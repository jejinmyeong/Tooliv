import styled from '@emotion/styled';
import React from 'react';
import { colors } from 'shared/color';

const WebHookContainer = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  text-align: center;
  .name {
    width: 25%;
  }
  .webhookid {
    width: 75%;
  }
  :hover {
    background-color: ${colors.gray100};
  }
  cursor: default;
`;

type webHookPropsType = {
  webHook: webhookResponseDTOList;
};

type webhookResponseDTOList = {
  created_at: '2022-05-24T14:11:48.827';
  name: 'test';
  userId: '1bc45d6d-8673-4c0e-8f22-763256881370';
  webhookId: 'ea73ce03-9045-45ac-8622-8260a1d88104';
};

const WebHook = ({ webHook }: webHookPropsType) => {
  return (
    <WebHookContainer>
      <div className="name">{webHook.name}</div>
      <div className="webhookid">{webHook.webhookId}</div>
    </WebHookContainer>
  );
};

export default WebHook;
