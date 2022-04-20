package com.tooliv.server.domain.workspace.application;

import com.tooliv.server.domain.channel.application.dto.response.ChannelGetResponseDTO;
import com.tooliv.server.domain.channel.domain.Channel;
import com.tooliv.server.domain.channel.domain.ChannelMembers;
import com.tooliv.server.domain.channel.domain.enums.ChannelMemberCode;
import com.tooliv.server.domain.user.domain.User;
import com.tooliv.server.domain.user.domain.repository.UserRepository;
import com.tooliv.server.domain.workspace.application.dto.request.ModifyWorkspaceRequestDTO;
import com.tooliv.server.domain.workspace.application.dto.request.RegisterWorkspaceRequestDTO;
import com.tooliv.server.domain.workspace.application.dto.response.WorkspaceGetResponseDTO;
import com.tooliv.server.domain.workspace.application.dto.response.WorkspaceListGetResponseDTO;
import com.tooliv.server.domain.workspace.domain.Workspace;
import com.tooliv.server.domain.workspace.domain.WorkspaceMembers;
import com.tooliv.server.domain.workspace.domain.enums.WorkspaceMemberCode;
import com.tooliv.server.domain.workspace.domain.repository.WorkspaceMemberRepository;
import com.tooliv.server.domain.workspace.domain.repository.WorkspaceRepository;
import com.tooliv.server.global.security.util.JwtAuthenticationProvider;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.hibernate.jdbc.Work;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    private final WorkspaceMemberRepository workspaceMemberRepository;

    private final UserRepository userRepository;

    @Transactional
    @Override
    public Integer registerWorkspace(RegisterWorkspaceRequestDTO registerWorkspaceRequestDTO) {

        User owner = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();

        boolean existWorkspace = workspaceRepository.existsByNameAndDeletedAt(registerWorkspaceRequestDTO.getName(), null);
        if (existWorkspace) {
            return 409;
        }

        Workspace workspace = Workspace.builder()
            .name(registerWorkspaceRequestDTO.getName())
            .createdAt(now)
            .build();

        workspaceRepository.save(workspace);

        WorkspaceMembers workspaceMembers = WorkspaceMembers.builder()
            .createdAt(now)
            .workspaceMemberCode(WorkspaceMemberCode.WADMIN)
            .user(owner)
            .workspace(workspace)
            .build();

        workspaceMemberRepository.save(workspaceMembers);

        Channel channel = Channel.builder().
            build();

        return 201;
    }

    @Transactional
    @Override
    public Integer modifyWorkspace(ModifyWorkspaceRequestDTO modifyWorkspaceRequestDTO) {
        Workspace workspace = workspaceRepository.findById(modifyWorkspaceRequestDTO.getId())
            .orElseThrow(() -> new IllegalArgumentException("해당 워크스페이스를 찾을 수 없습니다."));

        workspace.modifyWorkspace(modifyWorkspaceRequestDTO.getName());
        workspaceRepository.save(workspace);
        return 200;
    }

    @Transactional
    @Override
    public Integer deleteWorkspace(String workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new IllegalArgumentException("해당 워크스페이스를 찾을 수 없습니다."));
        workspace.deleteWorkspace();
        workspaceRepository.save(workspace);
        return 200;
    }

    @Override
    public WorkspaceListGetResponseDTO getWorkspaceList() {
        User user = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        List<Workspace> workspaceList = workspaceMemberRepository.findWorkspaceByUser(user);
        List<WorkspaceGetResponseDTO> workspaceGetResponseDTOList = new ArrayList<>();

        workspaceList.forEach(workspace -> {
            if(workspace.getDeletedAt().equals(null)){
                WorkspaceGetResponseDTO workspaceGetResponseDTO = WorkspaceGetResponseDTO.builder()
                    .id(workspace.getId())
                    .name(workspace.getName())
                    .build();
                workspaceGetResponseDTOList.add((workspaceGetResponseDTO));
            }
        });
        return new WorkspaceListGetResponseDTO(workspaceGetResponseDTOList);
    }
}
