<?php

namespace Wolf\Memberships\UseCase;

use stdClass;
use Wolf\Core\Db\Exception\DuplicateEntryException;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Mail\MailService;
use Wolf\Memberships\Helper\MemberHelper;
use Wolf\Memberships\Entity\Repository\MemberEntityRepositoryInterface;

class RegisterToCampaignUseCase implements UseCaseInterface
{
    private $campaignRepository;

    private $checkoutRepository;

    private $subscriptionRepository;

    private $sessionRepository;

    private MemberEntityRepositoryInterface $memberRepository;

    private $contactRepository;

    private MemberHelper $memberHelper;

    private MailService $mailService;

    public function __construct(EntityManager $entityManager, MemberHelper $memberHelper, MailService $mailService)
    {
        $this->campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
        $this->checkoutRepository = $entityManager->getRepository('wolf-memberships.checkout');
        $this->subscriptionRepository = $entityManager->getRepository('wolf-memberships.subscription');
        $this->sessionRepository = $entityManager->getRepository('wolf-memberships.session');
        $this->memberRepository = $entityManager->getRepository('wolf-memberships.member');
        $this->contactRepository = $entityManager->getRepository('wolf-memberships.contact');
        $this->memberHelper = $memberHelper;
        $this->mailService = $mailService;
    }

    public function execute(array $params = []): array
    {
        $campaignId = $params['campaignId'] ?? null;
        if (!$campaignId) {
            throw new \InvalidArgumentException('Campaign ID is required.');
        }

        $campaign = $this->campaignRepository->findById($campaignId);
        if (!$campaign) {
            throw new \Exception('Campaign not found.');
        }

        if ($campaign->registration_start && $campaign->registration_end) {
            $now = new \DateTime();
            $start = new \DateTime($campaign->registration_start);
            $end = new \DateTime($campaign->registration_end);

            if ($now < $start || $now > $end) {
                throw new \Exception('Registration is not open for this campaign.');
            }
        }

        try {
            $checkout = $this->createCheckout($campaign, $params['payer'] ?? []);

            $this->registerParticipants($campaign, $checkout, $params['participants'] ?? []);

        } catch (\Exception $e) {
            if ($e->getMessage() === 'Failed to register participant') {
                // Rollback the checkout if any error occurs during participant registration
                $this->checkoutRepository->delete($checkout->id);
                throw new \Exception('One or more participants are already registered for this campaign.');
            }

            throw $e; // Rethrow the exception after rollback

        }

        $editUrl = $this->buildEditUrl($campaign, $checkout);

        if (
            $this->sendConfirmationEmail($checkout->email, ['editUrl' => $editUrl]) === false
        ) {
            throw new \Exception('Failed to send confirmation email.');
        }

        return [
            'checkoutId' => $checkout->id,
        ];
    }

    private function createCheckout($campaign, $payer): stdClass
    {
        $checkout = $this->checkoutRepository->insert([
            'campaign_id' => $campaign->id,
            'firstname' => $payer['firstname'] ?? '',
            'lastname' => $payer['lastname'] ?? '',
            'email' => $payer['email'] ?? '',
            'phone' => $payer['phone'] ?? '',
            'status' => 'pending',
        ]);

        return $checkout;
    }

    private function registerParticipants($campaign, $checkout, $participants): void
    {
        foreach ($participants as $participant) {
            $this->registerParticipant($campaign, $checkout, $participant);
        }
    }

    private function registerParticipant($campaign, $checkout, $participant): void
    {
        $member = $this->getOrCreateMember($campaign, $checkout, $participant);

        $subscription = null;

        try {

            $subscription = $this->subscriptionRepository->insert([
                'campaign_id' => $campaign->id,
                'checkout_id' => $checkout->id,
                'member_id' => $member->id,
                'license_type' => $participant['license_type'] ?? 'hobby',
                'status' => 'pending',
                'address' => [
                    'line1' => $participant['line1'] ?? '',
                    'line2' => $participant['line2'] ?? '',
                    'postal_code' => $participant['zipcode'] ?? '',
                    'city' => $participant['city'] ?? '',
                    'country' => $participant['country'] ?? '',
                ],
            ]);


        } catch (DuplicateEntryException $e) {
            // Handle the exception, e.g., log it or rethrow
            throw new \Exception("Failed to register participant");
        }

        if ($member && $subscription && $participant['lesson_id'] ?? null) {
            $lessonId = $participant['lesson_id'];
            $this->sessionRepository->insert([
                'campaign_id' => $campaign->id,
                'lesson_id' => $lessonId,
                'subscription_id' => $subscription->id,
                'member_id' => $member->id,
                'status' => 'pending',
            ]);
        }
    }

    private function getOrCreateMember($campaign, $checkout, $participant): stdClass
    {
        $hash = $this->memberHelper->generateHash($participant['firstname'] ?? '', $participant['lastname'] ?? '', $participant['birthdate'] ?? '');
        $existingMemberId = $this->memberRepository->existsHash($hash);

        if ($existingMemberId) {
            return $this->memberRepository->findById($existingMemberId);
        }

        return $this->memberRepository->insert([
            'firstname' => $participant['firstname'] ?? '',
            'lastname' => $participant['lastname'] ?? '',
            'birthdate' => $participant['birthdate'] ?? null,
            'email' => $participant['email'] ?? '',
            'phone' => $participant['phone'] ?? '',
            'hash' => $hash,
        ]);
    }

    private function buildEditUrl($campaign, $checkout): string
    {
        $pageId = get_option('wolf_membership_registration_page');

        // Generate a unique token for edit URL
        $token = password_hash($checkout->id . $checkout->email, PASSWORD_DEFAULT);

        return get_permalink($pageId) . "?campaign_id={$campaign->id}&checkout_id={$checkout->id}&token={$token}";
    }

    private function sendConfirmationEmail($email, $context): bool
    {
        $subject = 'Registration Confirmation';

        return $this->mailService->sendMail($email, 'wolf-membership:confirmation', json_encode($context));

    }
}