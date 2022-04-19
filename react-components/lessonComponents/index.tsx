import ILesson from '@typings/ILesson';
import { getBackEndUrl } from '@utils/getEnv';
import { randomInt } from 'crypto';
import Link from 'next/link';
import { FC, useCallback, useEffect, useState } from 'react';

export interface LessonProps {
  lesson: ILesson;
  show: boolean;
}

const LessonComponent: FC<LessonProps> = ({ lesson, show }) => {
  const [start, setStart] = useState<boolean[]>();

  const optimizeImage = (src: string) => {
    // https 로 시작하면 그대로 리턴, 아니면 https 붙여서 리턴
    if (src.startsWith('https')) {
      return src;
    }

    return `${getBackEndUrl()?.replace('/api', '')}/${src}`;
  };

  useEffect(() => {
    const a = Math.floor(Math.random() * 5);
    const arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(false);
    }
    arr[a] = true;
    setStart(arr);
  }, []);
  return (
    <div className=" relative flex flex-col items-center w-full h-3/4  ">
      {/* <a href="#"> */}
      <div className="avatar w-3/5  ">
        <div className="rounded-xl ">
          <img src={optimizeImage(lesson?.imageURL)} className="object-cover " />
        </div>
      </div>
      {/* <img src={lesson.imageURL} className="rounded-t-lg  w-2/5" /> */}
      {/* </a> */}
      <div className="text-center rounded-b-lg  w-4/5 ">
        <div className="text-gray-700 h-10 lg:text-lg t  font-bold md:text-xm ">{!show && lesson.name}</div>
        <p className="text-gray-400 text-sm font-light ">{lesson.__teacher__?.user.username}</p>
        <p className="text-blue-600 text-lg font-bold ">₩{lesson.price}</p>
        <div className="rating rating-sm">
          <input type="radio" className="mask mask-star-2 bg-orange-400" />
          {start?.map((start, index) => {
            if (start) {
              return <input key={index} type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />;
            } else {
              return <input key={index} type="radio" className="mask mask-star-2 bg-orange-400" />;
            }
          })}
        </div>
      </div>
      {show && (
        <Link href={'/lessons/' + lesson.id}>
          <div>
            <div
              className=" absolute h-full w-full bg-black opacity-75  
		top-0 left-0 right-0 botton-0 text-center  "
            ></div>
            <div
              className=" absolute text-gray-900 
		   inset-0  w-full lg:text-2xl  font-bold p-4 md:text-sm"
            >
              <p className="text-white">{lesson.name}</p>
              <br></br>
              <p className=" lg:text-lg md:text-xs text-cyan-200">
                {lesson.introduce.length > 100 ? lesson.introduce.slice(0, 100) + '...' : lesson.introduce}
              </p>
              <br />
              <div className="badge badge-ghost">{lesson.type}</div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default LessonComponent;
