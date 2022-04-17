import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Lesson, TimeList } from '.';
import produce from 'immer';
import fetcher from '@lib/api/fetcher';
import client from '@lib/api/client';
import DayPicker from './DayPicker';
import { Scheduler } from '@aldabil/react-scheduler';

const CreateLessons = () => {
  const { data: lessonData, mutate } = useSWR<Lesson[]>('http://localhost:4000/api/lessons', fetcher);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Lesson>();

  const [timeList, setTimeList] = useState<TimeList>();

  const [fileImage, setFileImage] = useState('');

  const saveFileImage = (e: any) => {
    setFileImage(URL.createObjectURL(e.target.files[0]));
  };

  const deleteFileImage = () => {
    URL.revokeObjectURL(fileImage);
    setFileImage('');
  };

  const onSubmit = (data: Lesson) => {
    const { name, introduce, length, price, type, day, time } = data;
    console.log(data);

    client
      .post('lessons', { name, introduce, length, price, type, day, time }, { withCredentials: true })
      .then((res) => {
        mutate(
          produce((draft) => {
            draft.push(res.data.payload);
            console.log(res.data.payload);
          }),
          false,
        );
        return Router.push('/lessons');
      })
      .catch((error) => {
        console.log(error);
      });
    reset();
  };

  useEffect(() => {
    if (lessonData) console.log(lessonData);
  }, [lessonData]);

  const moveRouter = () => {
    Router.push('/lessons');
  };

  return (
    <div>
      <ul>
        <h1 className="pb-8">Create Lessons</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="input-group input-group-vertical">레슨 이름</label>
            <input
              type="text"
              placeholder="name"
              {...register('name')}
              className="input input-bordered w-full max-w-xs"
            />
            <br />
            <label>이미지 첨부</label>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div id="image">
                      {fileImage && <img alt="sample" src={fileImage} style={{ margin: 'auto' }} />}
                      <div
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <input id="image" name="imgUpload" type="file" accept="image/*" onChange={saveFileImage} />

                        <button className="btn" onClick={() => deleteFileImage()}>
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <label className="input-group input-group-vertical">가격</label>
            <input
              type="number"
              placeholder="price"
              {...register('price')}
              className="input input-bordered w-full max-w-xs"
            />
            <br />
            <label className="input-group input-group-vertical">레슨 타입</label>
            <select id="lessonType" {...register('type')} className="input input-bordered w-full max-w-xs">
              <option value="Sonata">Sonata</option>
              <option value="Etudes">Etudes</option>
              <option value="Waltzes">Waltzes</option>
              <option value="Nocturnes">Nocturnes</option>
              <option value="Marches">Marches</option>
            </select>
            <br />
            {/* <div className="relative">
              <label className="input-group input-group-vertical">레슨 일정</label>
              <select id="day" {...register('day')} className="input input-bordered w-full max-w-xs">
                <option value="1">일</option>
                <option value="2">월</option>
                <option value="3">화</option>
                <option value="4">수</option>
                <option value="5">목</option>
                <option value="6">금</option>
                <option value="7">토</option>
              </select>

              <br />
              <label className="input-group input-group-vertical">레슨 시간</label>
              <input type="time" step="2" {...register('time')} />
            </div> */}
            <DayPicker />
            <label className="input-group input-group-vertical">레슨 진행 시간</label>
            <input
              type="datetime"
              placeholder="length"
              {...register('length')}
              className="input input-bordered w-full max-w-xs"
            />
            <label className="input-group input-group-vertical">소개</label>
            <textarea
              className="w-full max-w-xs textarea textarea-bordered h-24"
              {...register('introduce')}
              placeholder="introduce"
            />
            <div>
              <button className="btn">등록</button>
              <button type="button" className="btn" onClick={moveRouter}>
                취소
              </button>
            </div>
          </form>
        </div>
      </ul>
    </div>
  );
};

export default CreateLessons;
