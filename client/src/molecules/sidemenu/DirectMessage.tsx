import styled from '@emotion/styled';
import React, { useState } from 'react';
import Icons from '../../atoms/common/Icons';
import Avatar from '../../atoms/profile/Avatar';
import Label from '../../atoms/common/Label';
import MenuTemplate from '../../atoms/sidemenu/MenuTemplate';
import { labelType } from '../../types/common/labelType';
import {
  InnerContainer,
  Noti,
  NotiWrapper,
  SideWrapper,
  TopContainer,
} from './Channels';
import Text from 'atoms/text/Text';
import DirectMessageModal from 'organisms/modal/sidemenu/DirectMessageModal';
import { useRecoilState } from 'recoil';
import { DMInfoType } from 'types/channel/chatTypes';
import { channelNotiList, DMList, dmName } from 'recoil/atom';
import { useNavigate, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { channelNotiType } from 'types/channel/contentType';

const FriendsContainer = styled.div`
  padding-left: 14px;
  padding-bottom: 18px;
  cursor: pointer;
`;
const FriendContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0 16px 0 8px;
  width: 220px;
  transition: 0.3s;
  cursor: pointer;
  box-sizing: content-box;
  background-color: ${(props) => props.isSelected && props.theme.hoverColor};
  border-radius: ${(props) => props.isSelected && `10px 0 0 10px`};
  border-right: ${(props) =>
    props.isSelected && `4px solid ${props.theme.darkPointColor}`};
  ${(props) =>
    css`
      &:hover {
        background-color: ${props.theme.hoverColor};
        border-radius: 10px 0 0 10px;
        border-right: 4px solid ${props.theme.hoverColor};
      }
    `}
`;

const DirectMessage = () => {
  const [userListOpen, setUserListOpen] = useState(false);
  const [dmList, setDmList] = useRecoilState<DMInfoType[]>(DMList);
  const [directName, setDirectName] = useRecoilState<string>(dmName);
  const [notiList, setNotiList] =
    useRecoilState<channelNotiType[]>(channelNotiList);
  const map = new Map(notiList.map((el) => [el.channelId, el]));
  const navigate = useNavigate();
  const { workspaceId, channelId } = useParams();
  console.log(notiList);
  const closeUserList = () => {
    setUserListOpen(false);
  };

  return (
    <>
      <TopContainer>
        <Text size={14}>개인 메시지</Text>
        <Icons icon="plus" onClick={() => setUserListOpen(!userListOpen)} />
      </TopContainer>
      <FriendsContainer>
        {dmList.map((dm) => (
          <FriendContainer
            key={dm.channelId}
            onClick={() => {
              setDirectName(dm.receiveName);
              navigate(`/direct/${workspaceId}/${dm.channelId}`);
            }}
            isSelected={channelId === dm.channelId}
          >
            <NotiWrapper>
              <InnerContainer>
                <SideWrapper>
                  <Avatar src={dm.profileImage} />
                </SideWrapper>
                <Label id={dm.channelId} name={dm.receiveName} />
              </InnerContainer>
              {!map.get(dm.channelId)?.notificationRead && <Noti>●</Noti>}
            </NotiWrapper>
          </FriendContainer>
        ))}
      </FriendsContainer>
      <DirectMessageModal isOpen={userListOpen} onClose={closeUserList} />
    </>
  );
};

export default DirectMessage;
