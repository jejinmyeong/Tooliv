import styled from '@emotion/styled';
import {
  getChannelInfo,
  getChannelUserCode,
  searchChannelMemberList,
} from 'api/channelApi';
import Icons from 'atoms/common/Icons';
import Text from 'atoms/text/Text';
import ChannelAddMemberModal from 'organisms/modal/channel/header/ChannelAddMemberModal';
import ChannelHeaderDropdown from 'organisms/modal/channel/header/ChannelHeaderDropdown';
import ChannelMemberListModal from 'organisms/modal/channel/header/ChannelMemberListModal';
import ChannelModifyModal from 'organisms/modal/channel/header/ChannelModifyModal';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentChannelNum,
  currentWorkspace,
  modifyChannelName,
} from 'recoil/atom';
import { colors } from '../../shared/color';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 76px;
  padding: 12px 40px;
  /* position: relative; */
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 0 5px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.dropdownHoverColor};
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
`;
const ChannelHeader = () => {
  const { channelId } = useParams();
  const currentWorkspaceId = useRecoilValue(currentWorkspace);
  const [channelName, setChannelName] = useState('');
  const [channelMemberNum, setChannelMemberNum] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [memeberListOpen, setMemberListOpen] = useState(false);
  const [addMemeberOpen, setAddMemberOpen] = useState(false);
  const [userCode, setUserCode] = useState('');

  const [currentChannelMemberNum, setCurrentChannelMemberNum] =
    useRecoilState(currentChannelNum);
  const modChannelName = useRecoilValue(modifyChannelName);

  // 새로고침시 채널별 인원수가 초기화 되므로 다시 저장하기 위한 useEffect
  useEffect(() => {
    if (currentChannelMemberNum === 0) {
      handleChannelInfo();
    }
  }, []);

  // 왜 필요했는지 모르겠움.. 필요시 주석 해제
  // useEffect(() => {
  //   if (currentChannelMemberNum !== 0) {
  //     setChannelMemberNum(currentChannelMemberNum);
  //   }
  // }, [currentChannelMemberNum]);

  useEffect(() => {
    if (channelId) {
      handleChannelInfo();
      getUserCode();
    } else {
      setChannelName('홈');
      setUserCode('');
    }
  }, [channelId, modChannelName]);

  const handleChannelInfo = async () => {
    try {
      // channelId로 channel명 및 명수 받아오는 api 있으면 좋을듯
      const { data } = await getChannelInfo(channelId!);
      console.log(data);
      setChannelName(data.name);
      setChannelMemberNum(data.numOfPeople);
      setCurrentChannelMemberNum(data.numOfPeople);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCode = async () => {
    const { data } = await getChannelUserCode(channelId!);
    setUserCode(data.channelMemberCode);
  };

  const handleAddMemberModalOpen = () => {
    setAddMemberOpen(true);
  };
  const handleModifyModalOpen = () => {
    setModifyModalOpen(true);
  };

  const closeMemberList = () => {
    setMemberListOpen(false);
  };

  const closeAddMemberModal = () => {
    setAddMemberOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  const closeModifyModal = () => {
    setModifyModalOpen(false);
  };

  return (
    <Container>
      <Title
        onClick={
          userCode === 'CADMIN'
            ? () => setDropdownOpen(!dropdownOpen)
            : undefined
        }
      >
        <Text size={18}>{channelName}</Text>
        {userCode === 'CADMIN' ? <Icons icon="dropdown" /> : null}
      </Title>
      {currentWorkspaceId !== 'main' ? (
        <Members
          onClick={() => {
            setMemberListOpen(!memeberListOpen);
          }}
        >
          <Icons
            icon="solidPerson"
            width="28"
            height="28"
            color={memeberListOpen ? 'blue100' : 'gray500'}
          />
          <Text
            size={16}
            color={memeberListOpen ? 'blue100' : 'gray500'}
            pointer
          >
            {String(channelMemberNum)}
          </Text>
        </Members>
      ) : null}

      <ChannelMemberListModal
        isOpen={memeberListOpen}
        onClick={handleAddMemberModalOpen}
        onClose={closeMemberList}
      />

      <ChannelAddMemberModal
        isOpen={addMemeberOpen}
        onClose={closeAddMemberModal}
        channelId={channelId!}
      />

      <ChannelHeaderDropdown
        isOpen={dropdownOpen}
        onClick={handleModifyModalOpen}
        onClose={closeDropdown}
      />
      <ChannelModifyModal
        isOpen={modifyModalOpen}
        onClose={closeModifyModal}
        channelName={channelName}
      />
    </Container>
  );
};

export default ChannelHeader;
