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
    'wolf-memberships.controller.contact' => [
        'class' => \Wolf\Memberships\Controller\ContactController::class
    ],
    'wolf-memberships.controller.wheel' => [
        'class' => \Wolf\Memberships\Controller\WheelController::class
    ],
    'wolf-memberships.controller.wheel_assignment' => [
        'class' => \Wolf\Memberships\Controller\WheelAssignmentController::class
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
            '@wolf.db'
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
            '@wolf-memberships.helper.member'
        ],
        'tags' => [
            [
                'name' => 'use_case',
                'value' => 'wolf-memberships.import_subscriptions'
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
];