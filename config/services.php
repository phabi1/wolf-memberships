<?php
return [
    'wolf-memberships.controller.dashboard' => [
        'class' => \Wolf\Memberships\Controller\DashboardController::class,
        'arguments' => [
            '@wolf-memberships.dashboard.source_bus'
        ]
    ],
    'wolf-memberships.controller.campaign' => [
        'class' => \Wolf\Memberships\Controller\CampaignController::class
    ],
    'wolf-memberships.controller.member' => [
        'class' => \Wolf\Memberships\Controller\MemberController::class,
        'arguments' => [
            '@wolf.use_case_bus',
            '@wolf-memberships.entity.service.member'
        ]
    ],
    'wolf-memberships.controller.subscription' => [
        'class' => \Wolf\Memberships\Controller\SubscriptionController::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ]
    ],
    'wolf-memberships.controller.session' => [
        'class' => \Wolf\Memberships\Controller\SessionController::class
    ],
    'wolf-memberships.controller.lesson' => [
        'class' => \Wolf\Memberships\Controller\LessonController::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ]
    ],
    'wolf-memberships.controller.period' => [
        'class' => \Wolf\Memberships\Controller\PeriodController::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ]
    ],
    'wolf-memberships.controller.registration' => [
        'class' => \Wolf\Memberships\Controller\RegistrationController::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ]
    ],
    'wolf-memberships.controller.contact' => [
        'class' => \Wolf\Memberships\Controller\ContactController::class
    ],
    'wolf-memberships.controller.wheel' => [
        'class' => \Wolf\Memberships\Controller\WheelController::class
    ],
    'wolf-memberships.controller.wheel_assignment' => [
        'class' => \Wolf\Memberships\Controller\WheelAssignmentController::class
    ],
    'wolf-memberships.controller.request' => [
        'class' => \Wolf\Memberships\Controller\RequestController::class
    ],
    'wolf-memberships.controller.file' => [
        'class' => \Wolf\Memberships\Controller\FileController::class
    ],
    'wolf-memberships.dashboard.source_bus' => [
        'class' => \Wolf\Memberships\Dashboard\SourceBus::class
    ],
    'wolf-memberships.entity.service.member' => [
        'class' => \Wolf\Memberships\Entity\Service\MemberEntityService::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf-memberships.helper.member'
        ]
    ],
    'wolf-memberships.helper.member' => [
        'class' => \Wolf\Memberships\Helper\MemberHelper::class,
        'arguments' => [
            '@wolf.helper.string'
        ]
    ],
    'wolf-memberships.entity.service.subscription' => [
        'factory' => [\Wolf\Memberships\Entity\Service\SubscriptionEntityServiceFactory::class, 'create'],
        'arguments' => [
            '@wolf.entity.manager',
        ]
    ],
    'wolf-memberships.dashboard.source.lessons_completude' => [
        'class' => \Wolf\Memberships\Dashboard\Source\LessonsCompletude::class,
        'arguments' => [
            '@wolf.use_case_bus'
        ],
        'tags' => [
            [
                'name' => 'wolf-memberships.dashboard.source',
                'value' => 'lessons_completude'
            ]
        ]
    ],
    'wolf-memberships.dashboard.source.get_periods_for_print' => [
        'class' => \Wolf\Memberships\Dashboard\Source\GetPeriodsForPrint::class,
        'arguments' => [
            '@wolf.entity.manager'
        ],
        'tags' => [
            [
                'name' => 'wolf-memberships.dashboard.source',
                'value' => 'get_periods_for_print'
            ]
        ]
    ],
    'wolf-memberships.use_case.get_lessons_completude' => [
        'class' => \Wolf\Memberships\UseCase\GetLessonsCompletudeUseCase::class,
        'arguments' => [
            '@wolf.db',
            '@wolf.helper.date'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.get_lessons_completude'
            ]
        ]
    ],
    'wolf-memberships.use_case.import_members' => [
        'class' => \Wolf\Memberships\UseCase\ImportMembersUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf-memberships.helper.member'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.import_members'
            ]
        ]
    ],
    'wolf-memberships.use_case.import_subscriptions' => [
        'class' => \Wolf\Memberships\UseCase\ImportSubscriptionsUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf-memberships.helper.member',
            '@wolf.helper.date'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.import_subscriptions'
            ]
        ]
    ],
    'wolf-memberships.use_case.export_subscriptions' => [
        'class' => \Wolf\Memberships\UseCase\ExportSubscriptionsUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf-memberships.helper.member'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.export_subscriptions'
            ]
        ]
    ],
    'wolf-memberships.use_case.print_period' => [
        'class' => \Wolf\Memberships\UseCase\PrintPeriodUseCase::class,
        'arguments' => [
            '@wolf.entity.manager'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.print_period'
            ]
        ]
    ],
    'wolf-memberships.use_case.exists_member' => [
        'class' => \Wolf\Memberships\UseCase\ExistsMemberUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf-memberships.helper.member'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.exists_member'
            ]
        ]
    ],
    'wolf-memberships.use_case.get_registration_for_campaign' => [
        'class' => \Wolf\Memberships\UseCase\GetRegistrationUseCase::class,
        'arguments' => [
            '@wolf.entity.manager'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.get_registration_for_campaign'
            ]
        ]
    ],
    'wolf-memberships.use_case.register_to_campaign' => [
        'class' => \Wolf\Memberships\UseCase\RegisterToCampaignUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf.mail'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.register_to_campaign'
            ]
        ]
    ],
    'wolf-memberships.use_case.update_request' => [
        'class' => \Wolf\Memberships\UseCase\UpdateRequestUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf.mail'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.update_request'
            ]
        ]
    ],
    'wolf-memberships.use_case.calculate_registration_total' => [
        'class' => \Wolf\Memberships\UseCase\CalculateRegistrationTotalUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.calculate_registration_total'
            ]
        ]
    ],
    'wolf-memberships.use_case.mark_as_approved_request' => [
        'class' => \Wolf\Memberships\UseCase\MarkAsApprovedRequestUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf.mail'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.approve_request'
            ]
        ]
    ],
    'wolf-memberships.use_case.mark_as_rejected_request' => [
        'class' => \Wolf\Memberships\UseCase\MarkAsRejectedRequestUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf.mail'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.reject_request'
            ]
        ]
    ],
    'wolf-memberships.use_case.mark_as_cancelled_request' => [
        'class' => \Wolf\Memberships\UseCase\MarkAsCancelledRequestUseCase::class,
        'arguments' => [
            '@wolf.entity.manager',
            '@wolf.mail'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.cancel_request'
            ]
        ]
    ]
];