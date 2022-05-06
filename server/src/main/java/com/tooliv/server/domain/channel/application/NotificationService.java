package com.tooliv.server.domain.channel.application;

import com.tooliv.server.domain.channel.application.dto.response.DirectListResponseDTO;
import com.tooliv.server.domain.channel.application.dto.response.NotificationListResponseDTO;
import com.tooliv.server.domain.channel.domain.DirectChatRoom;
import com.tooliv.server.domain.user.domain.User;

public interface NotificationService {

    NotificationListResponseDTO getNotificationList(String email);

    DirectListResponseDTO getDirectNotificationList(String email);

    void createDirectChatNotification(User user, DirectChatRoom directChatRoom);

    void readDirectChatNotification(User user, DirectChatRoom directChatRoom);
}
