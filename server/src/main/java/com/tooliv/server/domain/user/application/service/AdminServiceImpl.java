package com.tooliv.server.domain.user.application.service;

import com.tooliv.server.domain.user.application.dto.request.SignUpRequestDTO;
import com.tooliv.server.domain.user.application.dto.request.UserCodeUpdateRequestDTO;
import com.tooliv.server.domain.user.application.dto.response.UserInfoResponseDTO;
import com.tooliv.server.domain.user.application.dto.response.UserListResponseDTO;
import com.tooliv.server.domain.user.domain.User;
import com.tooliv.server.domain.user.domain.enums.UserCode;
import com.tooliv.server.domain.user.domain.repository.UserRepository;
import com.tooliv.server.domain.user.exception.NotUniqueEmailException;
import com.tooliv.server.domain.user.exception.UserNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public UserListResponseDTO getUserList(String keyword) {
        List<UserInfoResponseDTO> userInfoResponseDTOList = new ArrayList<>();

        for (User user : userRepository.findAllByUserCodeNotAndDeletedAtAndNameContainingOrderByNameAsc(UserCode.ADMIN, null, keyword)
            .orElseThrow(() -> new IllegalArgumentException("조회 가능한 회원이 없음"))) {
            userInfoResponseDTOList.add(new UserInfoResponseDTO(user.getId(), user.getEmail(), user.getName(), user.getNickname(), user.getUserCode(), getImageURL(user.getProfileImage())));
        }

        return new UserListResponseDTO(userInfoResponseDTOList, userInfoResponseDTOList.size());
    }

    @Override
    public void updateUserCode(UserCodeUpdateRequestDTO userCodeUpdateRequestDTO) {
        User user = userRepository.findByEmailAndDeletedAt(userCodeUpdateRequestDTO.getEmail(), null)
            .orElseThrow(() -> new IllegalArgumentException("조회 가능한 회원이 없음"));

        user.updateUserCode(userCodeUpdateRequestDTO.getUserCode());

        userRepository.save(user);
    }

    @Override
    public void checkEmail(String email) throws NotUniqueEmailException {
        boolean emailExists = userRepository.existsByEmailAndDeletedAt(email, null);

        if (emailExists) {
            throw new NotUniqueEmailException("해당 이메일은 중복임");
        }
    }

    @Override
    public void deleteUser(String email) {
        System.out.println("email : " + email);
        User user = userRepository.findByEmailAndDeletedAt(email, null).orElseThrow(() -> new UserNotFoundException("회원 정보가 존재하지 않습니다."));

        user.deleteUser(LocalDateTime.now());

        userRepository.save(user);
    }

    @Override
    public User getCurrentUser() {
        User user = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        return user;
    }

    @Override
    public String getImageURL(String fileName) {
        return "https://tooliva402.s3.ap-northeast-2.amazonaws.com/" + fileName;
    }
}
