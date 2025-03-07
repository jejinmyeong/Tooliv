import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { updateNickname, updateProfileImage } from 'api/userApi';
import Button from 'atoms/common/Button';
import Icons from 'atoms/common/Icons';
import Label from 'atoms/label/Label';
import Avatar from 'atoms/profile/Avatar';
import Text from 'atoms/text/Text';
import InputBox from 'molecules/inputBox/InputBox';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { user } from 'recoil/auth';
import { userConfigType } from 'types/common/userTypes';

const Modal = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(255, 255, 255, 0.7);

  ${(props) =>
    props.isOpen &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}
`;

const Container = styled.div`
  width: 350px;
  padding: 25px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 30px;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ButtonBox = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  margin-left: auto;
`;

const AvatarBox = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const InputContainer = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const UserConfigModal = ({ isOpen, onClose }: userConfigType) => {
  const [nickName, setNickName] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [imgFile, setImgFile] = useState('');
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputNickNameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useRecoilState(user);
  // const localUserInfo = localStorage.getItem('user');
  // const Juser = JSON.parse(localUserInfo!);

  const onChange = () => {
    setNickName(inputNickNameRef.current?.value!);
  };

  const exitModal = () => {
    inputNameRef.current!.value = '';
    inputEmailRef.current!.value = '';
    inputNickNameRef.current!.value = '';
    onClose();
  };
  useEffect(() => {
    inputNameRef.current!.value = userInfo.name;
    inputEmailRef.current!.value = userInfo.email;
    inputNickNameRef.current!.value = userInfo.nickname;
    setNickName(inputNickNameRef.current!.value);
    setImgSrc(userInfo.profileImage);
  }, [isOpen, userInfo]);

  const uploadImg = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFile = async (event: any) => {
    const file = event.target.files;
    setImgFile(file[0]);
    setImgSrc(URL.createObjectURL(file[0]));
  };

  const updateprofile = async () => {
    if (!nickName) {
      alert('닉네임을 확인해주세요.');
    } else {
      const formData = new FormData();
      formData.append('multipartFile', imgFile);
      const body = {
        nickname: nickName,
      };
      if (imgFile !== '') {
        await updateProfileImage(formData);
        await updateNickname(body);
        setUserInfo({ ...userInfo, profileImage: imgSrc, nickname: nickName });
        exitModal();
      } else {
        await updateNickname(body);
        setUserInfo({ ...userInfo, nickname: nickName });
        exitModal();
      }
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <Container>
        <Header>
          <Text size={18}>계정 설정</Text>
          <Icons icon="xMark" width="32" height="32" onClick={exitModal} />
        </Header>
        <AvatarBox onClick={uploadImg}>
          <Label label="프로필" />
          <Avatar src={imgSrc} size="130" />
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            name="userProfilePhoto"
            onChange={handleUploadFile}
            ref={fileInputRef}
          />
        </AvatarBox>
        <InputContainer>
          <InputBox
            label="이름"
            placeholder="이름을 입력해주세요."
            ref={inputNameRef}
            disabled
          />
          <InputBox
            label="이메일"
            placeholder="이메일을 입력해주세요."
            ref={inputEmailRef}
            onChange={onChange}
            disabled
          />

          <InputBox
            label="닉네임"
            placeholder="닉네임을 입력해주세요."
            ref={inputNickNameRef}
            onChange={onChange}
          />
        </InputContainer>
        <ButtonBox>
          <Button
            width="85"
            height="35"
            text="취소"
            bgColor="gray300"
            onClick={exitModal}
          />
          <Button
            width="85"
            height="35"
            text="수정"
            // disabled={inputRef.current?.value === ''}
            onClick={updateprofile}
          />
        </ButtonBox>
      </Container>
    </Modal>
  );
};

export default UserConfigModal;
