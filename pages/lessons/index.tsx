import useUserSWR from '@hooks/swr/useUserSWR';
import fetcher from '@lib/api/fetcher';
import LessonComponent from '@react-components/lessonComponents';
import LessonNoSearchComponent from '@react-components/lessonComponents/noSearchResult';
import ILesson from '@typings/ILesson';
import produce from 'immer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
interface ISearchForm {
  wordSearch: string;
}

const LessonsIndexPage = () => {
  const router = useRouter();
  const { searchKeyword, searchWord, order } = router.query;

  const { register, handleSubmit, resetField } = useForm<ISearchForm>();

  const onSearchSubmit = (data: ISearchForm) => {
    if (data.wordSearch.length < 2) {
      return alert('2글자 이상 검색해 주세요');
    }
    resetField('wordSearch');
    router.push(`/lessons?searchWord=${data.wordSearch}`);
  };

  const { data: userData } = useUserSWR();
  const {
    data: LessonDataList,
    mutate: mutateLessonData,
    setSize,
  } = useSWRInfinite<ILesson[]>(
    (index) =>
      searchKeyword
        ? `/lessons/type?searchKeyword=${searchKeyword}&perPage=8&page=${index + 1}&order=${order}`
        : searchWord
        ? `/lessons/search?searchKeyword=${searchWord}&perPage=8&page=${index + 1}&order=${order}`
        : `/lessons?perPage=8&page=${index + 1}&order=${order}`,
    fetcher,
  );
  const [isListHover, setIsListHover] = useState<number>(-1);

  const [current, setCurrent] = useState<number>(1);

  const onPage = useCallback(
    (page: number, current) => () => {
      if (current + page == 0) return;
      if (page > 0 && LessonDataList && LessonDataList[current - 1]?.length <= 7) {
        return;
      }
      setSize((prevSize) => {
        const current = prevSize + page;
        setCurrent(current);
        return current;
      });
    },
    [setSize, LessonDataList],
  );

  const orderChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const order = event.target.value;
      if (searchKeyword) {
        return router.push(`/lessons?searchKeyword=${searchKeyword}&order=${order}`);
      } else if (searchWord) {
        return router.push(`/lessons?searchWord=${searchWord}&order=${order}`);
      } else {
        router.push(`/lessons?order=${order}`);
      }
    },
    [router, searchKeyword, searchWord],
  );

  return (
    <div className="relative ">
      <div className="flex flex-col items-end mt-4">
        {userData?.teacher && (
          <Link href="/lessons/createLesson">
            <a className="bg-primary p-1 rounded font-bold text-sm hover:bg-gray-500">레슨생성</a>
          </Link>
        )}
      </div>
      <div className="flex h-screen p-4">
        <div className="container    w-52 ">
          <div className=" flex flex-col items-center border bg-gray-100">
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              <Link href={`/lessons`}>
                <a>전체보기 </a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Sonata`}>
                <a>Sonata</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal border-b-2  w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Etudes`}>
                <a>Etudes</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal  border-b-2    w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Waltzes`}>
                <a>Waltzes</a>
              </Link>
            </div>
            <div className="p-2 text-md text-center font-normal   w-full">
              {' '}
              <Link href={`/lessons?searchKeyword=Marches`}>
                <a>Marches</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full w-4/5 gap-2 ">
          {/* <div className="w-full  border-b-2 p-2 flex flex-row-reverse	 items-end"> */}
          <form
            onSubmit={handleSubmit(onSearchSubmit)}
            className="w-full  border-b-2 p-2 flex flex-row-reverse	 items-end"
          >
            <button className="bg-yellow-400 h-full p-2 font-bold text-white w-1/8">검색</button>
            <input
              type="text"
              className="border p-2 text-sm h-full focus:outline-yellow-500 w-1/8  "
              {...register('wordSearch')}
              placeholder="레슨 검색하기"
            />
          </form>
          {/* </div> */}
          <div className="w-full p-2 flex flex-row-reverse	items-center mb-4">
            <select onChange={orderChange} className="select select-bordered select-sm  max-w-xs">
              <option selected value={'created_at'}>
                최신순
              </option>
              <option value={'price'}>가격순</option>
              <option value={'grade'}>평점순</option>
            </select>
          </div>
          {LessonDataList && LessonDataList[0]?.length > 0 ? (
            <div className="container grid grid-cols-4 grid-rows-2 grid-flow-rows h-full w-full   ">
              {LessonDataList[current - 1]?.map((lesson) => {
                return (
                  <div
                    key={lesson.id}
                    onMouseEnter={() => setIsListHover(lesson.id)}
                    onMouseLeave={() => setIsListHover(-1)}
                  >
                    <LessonComponent lesson={lesson} show={lesson.id === isListHover} />
                  </div>
                );
              })}
            </div>
          ) : (
            <LessonNoSearchComponent />
          )}
        </div>
      </div>
      {LessonDataList && LessonDataList[0]?.length > 0 && (
        <div className={` absolute bottom-30 w-full left-1/2`}>
          <div className="btn-group ">
            <button className="btn" onClick={onPage(-1, current)}>
              «
            </button>
            <button className="btn">{current}</button>
            <button className="btn" onClick={onPage(1, current)}>
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsIndexPage;
