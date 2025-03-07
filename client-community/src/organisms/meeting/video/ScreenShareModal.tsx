import styled from '@emotion/styled';
import Button from 'atoms/common/Button';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../shared/color';
import { screenShareMadalPropsTypes } from '../../../types/meeting/openviduTypes';

export const BulrContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
`;
const ModalContainer = styled.div`
  position: absolute;
  width: 55vw;
  height: 90vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  height: 48px;
  justify-content: center;
  position: relative;
  gap: 4px;
`;

const Title = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
`;

const SubTitle = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: center;
  color: ${colors.gray500};
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  gap: 10px;
  right: 10px;
  top: 10px;
`;

const ListContainer = styled.div`
  height: calc(90vh - 48px);
  overflow-y: scroll;
  overflow-x: hidden;
`;

const ScreenItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 20px;

  img {
    width: 15vw;
    height: 15vh;
    object-fit: contain;
    background-color: ${colors.black};
  }
  .name {
    font-size: 14px;
    color: ${(props) => props.theme.textColor};
    overflow: hidden;
    width: calc(40vw - 80px);
  }
  :hover {
    background-color: ${(props) => props.theme.dropdownHoverColor};
  }
  background-color: ${(props) =>
    props.isSelected ? props.theme.selectedItemColor : ''};
`;

const ScreenShareModal = ({
  setIsScreenShareModal,
  setChoiceScreen,
  setDoStartScreenSharing,
}: screenShareMadalPropsTypes) => {
  const [screenList, setScreenList] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [screenId, setScreenId] = useState<string>('');
  const desktopCapturer = {
    getSources: async (opts: any) =>
      window.ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts),
  };
  const getScreenSource = async () => {
    return await desktopCapturer.getSources({ types: ['window', 'screen'] });
  };

  useEffect(() => {
    if (!isLoading) {
      getScreenSource().then((data) => {
        setScreenList(data);
        setIsLoading(true);
      });
    }
  }, [isLoading]);

  const onClickScreenItem = () => {
    setChoiceScreen(screenId);
    setIsScreenShareModal(false);
  };

  const onClose = () => {
    setIsScreenShareModal(false);
    setDoStartScreenSharing(false);
  };

  return (
    <BulrContainer>
      <ModalContainer>
        <Header>
          <Title>화면 목록</Title>
          <ButtonContainer>
            <Button
              text="공유시작"
              onClick={onClickScreenItem}
              disabled={screenId ? false : true}
              width="80"
              height="28"
            />
            <Button
              text="취소"
              onClick={onClose}
              width="50"
              height="28"
              bgColor="gray300"
            />
          </ButtonContainer>
          <SubTitle>공유할 화면을 선택해주세요.</SubTitle>
        </Header>
        <ListContainer>
          {isLoading &&
            screenList.map((stream: any) => (
              <ScreenItem
                key={stream.id}
                onClick={() => setScreenId(stream.id)}
                isSelected={stream.id === screenId}
              >
                <img alt={stream.name} src={stream.thumbnail.toDataURL()} />
                <div className="name">{stream.name}</div>
              </ScreenItem>
            ))}
        </ListContainer>
      </ModalContainer>
    </BulrContainer>
  );
};

export default ScreenShareModal;
