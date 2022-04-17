import useUserSWR from '@hooks/swr/useUserSWR';
import { IMessage } from '@typings/IMessage';
import { INotification } from '@typings/INotification';
import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

export interface NotificaitonProps {
  notification: INotification;
}

const Notificaiton: FC<NotificaitonProps> = ({ notification }) => {
  const { data: userData } = useUserSWR();
  const [titile, setTitle] = useState<string>();
  // const [introduce, setIntroduce] = useState<string>();
  const [image, setImage] = useState<string>(
    'data:image/jpeg;base64,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',
  );
  // useEffect(() => {
  //   if (!notification) return;
  //   if (notification.signup) {
  //     setTitle('수강등록');
  //     setIntroduce(notification.signup.__user__.username + '님이 수강등록 하셨습니다.');
  //     if (notification.signup.__user__.profile_image) {
  //       setImage(notification.signup.__user__.profile_image);
  //     }
  //     return;
  //   }
  //   if (notification.commentId) {
  //     setTitle('댓글');
  //     setIntroduce(`${notification.comment.user.username}님이  ${notification.comment.contents}`.slice(0, 30) + '...');
  //   }
  // }, [notification]);

  return (
    <div className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden w-full h-full ">
      <div className="w-2 bg-gray-800"></div>
      <div className="flex items-center px-2 py-3">
        <img className="w-6 h-6 object-cover rounded-full" src={image} />
        <div className="mx-3">
          <h2 className="text-m font-semibold text-gray-800">{notification.type}</h2>
          <div className="flex flex-row ">
            <p>{notification.content} </p>
            <p className="text-gray-600 text-sm place-self-end ">{notification.readTime ? '읽음' : '안읽음'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notificaiton;
