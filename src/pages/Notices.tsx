import { axiosInstance } from "@/utils/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Notices = () => {
  //  Page Title
  useEffect(() => {
    document.title = "Notices | Grid Manager";
  }, []);

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  const {
    data: notices,
    isLoading,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notices"],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/get-notices", {
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Fetching next set of leagues
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, notices?.pages?.length]);

  console.log(notices);

  return (
    <div className="p-8 max-w-4xl mx-auto text-left space-y-8">
      <h1 className="text-4xl py-4 font-bold text-primary text-center">
        Notices
      </h1>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="space-y-6">
          {notices &&
            notices?.pages?.map((page) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return page?.data.notices?.map((notice: any) => {
                return (
                  <div
                    key={notice?.id}
                    className="bg-white dark:bg-white/5 shadow-md rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {notice.title}
                    </h3>
                    <p>{notice.content}</p>

                    <p className="text-gray-400 mt-4 text-sm">
                      {new Date(notice?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              });
            })}

          {isLoading &&
            Array(3)
              .fill(null)
              ?.map((_, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-white/5 shadow-md rounded-2xl p-6"
                  >
                    <h3 className="text-xl w-60 h-6 bg-gray-400 animate-pulse rounded-md font-semibold mb-2"></h3>
                    <p className="w-96 h-4 bg-gray-400 animate-pulse rounded-md"></p>

                    <p className="text-gray-400 w-60 h-4 bg-gray-400 animate-pulse rounded-md mt-4 text-sm"></p>
                  </div>
                );
              })}

          {(error ||
            (notices && notices?.pages?.[0]?.data?.notices.length == 0)) && (
            <p className="text-center py-5">No Notices found.</p>
          )}
        </div>

        <div ref={ref}></div>
      </section>
    </div>
  );
};

export default Notices;
