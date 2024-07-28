<?php

//edit bellow three things

$botToken = '7464762448:AAGnsCHNR_ATx1rRzwiyyT3U470-40Y46WM';
$botusername = 'MPXChannelManagementBot';
$webhookUrl = 'https://hhk.my.id/tgchban.php';

//no need to edit bellow

$update = file_get_contents('php://input');
$updateData = json_decode($update, true);

if (isset($updateData['message'])) {
    $chatId = $updateData['message']['chat']['id'];
    $userId = $updateData['message']['from']['id'];
    $messageText = $updateData['message']['text'];

    if ($messageText === '/start') {
        $keyboard = [
            'inline_keyboard' => [
                [
                    ['text' => 'Add to Channel', 'url' => 'https://t.me/'.$botusername.'?startgroup=invite_to_channel']
                ]
            ]
        ];

        $keyboard = json_encode($keyboard);

        $welcomeMessage = "Hello! *UserFirstName*, welcome to Auto Kicker Bot. I can ban users who leave your channel. Just add me to your channel and make me an admin with ban user rights! \n\n Prowered by @MPXStore!";
        $welcomeMessage = str_replace('*UserFirstName*', $updateData['message']['from']['first_name'], $welcomeMessage);

        $apiRequest = [
            'chat_id' => $chatId,
            'text' => $welcomeMessage,
            'parse_mode' => 'Markdown',
            'reply_markup' => $keyboard
        ];

        file_get_contents('https://api.telegram.org/bot' . $botToken . '/sendMessage?' . http_build_query($apiRequest));
    }
}

if (isset($updateData['chat_member']) && $updateData['chat_member']['new_chat_member']['status'] === 'left') {
    $chatId = $updateData['chat_member']['chat']['id'];
    $userId = $updateData['chat_member']['from']['id'];
    $apiRequest = [
        'chat_id' => $chatId,
        'user_id' => $userId
    ];

    file_get_contents('https://api.telegram.org/bot' . $botToken . '/banChatMember?' . http_build_query($apiRequest));
}

$setWebhookRequest = [
    'url' => $webhookUrl,
    'allowed_updates' => json_encode(['message', 'chat_member', 'left_chat_member'])
];

file_get_contents('https://api.telegram.org/bot' . $botToken . '/setWebhook?' . http_build_query($setWebhookRequest));
?>