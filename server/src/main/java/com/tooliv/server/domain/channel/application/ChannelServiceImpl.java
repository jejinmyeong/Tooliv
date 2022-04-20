package com.tooliv.server.domain.channel.application;

import com.tooliv.server.domain.channel.application.dto.request.ModifyChannelRequestDTO;
import com.tooliv.server.domain.channel.application.dto.request.RegisterChannelMemberRequestDTO;
import com.tooliv.server.domain.channel.domain.Channel;
import com.tooliv.server.domain.channel.application.dto.request.RegisterChannelRequestDTO;
import com.tooliv.server.domain.channel.domain.ChannelMembers;
import com.tooliv.server.domain.channel.domain.enums.MemberCode;
import com.tooliv.server.domain.channel.domain.repository.ChannelMembersRepository;
import com.tooliv.server.domain.channel.domain.repository.ChannelRepository;
import com.tooliv.server.domain.user.domain.User;
import com.tooliv.server.domain.user.domain.repository.UserRepository;
import com.tooliv.server.domain.workspace.domain.Workspace;
import com.tooliv.server.domain.workspace.domain.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChannelServiceImpl implements ChannelService {

    private final WorkspaceRepository workspaceRepository;

    private final ChannelRepository channelRepository;

    private final ChannelMembersRepository channelMembersRepository;

    private final UserRepository userRepository;

    @Transactional
    @Override
    public void registerChannel(RegisterChannelRequestDTO registerChannelRequestDTO) {

        User owner = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();
        Workspace workspace = workspaceRepository.findByIdAndDeletedAt(registerChannelRequestDTO.getWorkspaceId(), null)
            .orElseThrow(() -> new IllegalArgumentException("워크스페이스 정보가 존재하지 않습니다."));

        Channel channel = Channel.builder()
            .name(registerChannelRequestDTO.getName())
            .privateYn(registerChannelRequestDTO.isPrivateYn())
            .createdAt(now)
            .channelCode(registerChannelRequestDTO.getChannelCode())
            .description(registerChannelRequestDTO.getDescription())
            .workspace(workspace)
            .build();

        channelRepository.save(channel);

        ChannelMembers channelMembers = ChannelMembers.builder()
            .createdAt(now)
            .memberCode(MemberCode.OWNER)
            .user(owner)
            .channel(channel)
            .build();

        channelMembersRepository.save(channelMembers);

    }

    @Transactional
    @Override
    public Integer modifyChannel(ModifyChannelRequestDTO modifyChannelRequestDTO) {
        Channel channel = channelRepository.findById(modifyChannelRequestDTO.getId())
            .orElseThrow(() -> new IllegalArgumentException("채널 정보가 존재하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();
        try {
            channel.modifyChannel(modifyChannelRequestDTO.getName(), modifyChannelRequestDTO.getDescription());
        } catch (Exception e) {
            return 409;
        }
        channelRepository.save(channel);
        return 200;
    }

    @Transactional
    @Override
    public Integer deleteChannel(String channelId) {
        Channel channel = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("채널 정보가 존재하지 않습니다."));

        try {
            channel.deleteChannel();
        } catch (Exception e) {
            return 409;
        }

        channelRepository.save(channel);
        return 200;
    }

}
