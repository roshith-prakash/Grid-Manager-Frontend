import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import HashLoader from "react-spinners/HashLoader";
import { RxCross2 } from "react-icons/rx";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";

const ConstructorModal = ({
  constructorId,
  isModalOpen,
  closeModal,
}: {
  constructorId: string;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const {
    data: constructor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["constructor", constructorId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-constructors-stats", {
        constructorId,
      });
    },
    enabled: !!constructorId,
  });

  return (
    <Modal
      className="w-full !max-w-4xl px-0 py-0 noscroller"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <HashLoader
            color={"#9b0ced"}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {error && (
        <p className="text-center">Could not fetch constructor data!</p>
      )}

      {constructor?.data?.constructor && (
        <>
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          {/* Constructor Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* constructor Image Section */}
              <div className="flex flex-col bg-white items-center pb-5 py-4 px-5 border-b-2">
                <img
                  src={
                    constructor?.data?.constructor?.logo
                      ? constructor?.data?.constructor?.logo
                      : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                  }
                  className="h-36 object-contain"
                />
                <img
                  src={
                    constructor?.data?.constructor?.carImage
                      ? constructor?.data?.constructor?.carImage
                      : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                  }
                />
              </div>
            </div>
            <div className="w-full md:flex-1 border-b-4">
              {/* constructor Data */}
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="text-2xl text-ellipsis text-nowrap font-semibold">
                  {constructor?.data?.constructor?.name}
                </h3>

                <p className="text-md">
                  {constructor?.data?.constructor?.points
                    ? "Points"
                    : "Points scored for you"}
                  :{" "}
                  <span className="font-semibold">
                    {constructor?.data?.constructor?.points
                      ? constructor?.data?.constructor?.points
                      : constructor?.data?.constructor?.pointsForTeam}
                  </span>
                </p>
                <p className="text-md">
                  Price:{" "}
                  <span className="font-semibold">
                    {constructor?.data?.constructor?.price} Cr.
                  </span>
                </p>
                <p className="text-md">
                  Teams in which constructor is present:{" "}
                  <span className="font-semibold">
                    {Number(
                      constructor?.data?.constructor?.chosenPercentage
                    ).toFixed(0)}
                    %{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* constructor Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
            <p className="text-xl font-medium">
              {" "}
              {constructor?.data?.constructor?.pointsHistory?.length > 0
                ? "Points Scored"
                : "Points Scored for you"}
              :{" "}
            </p>

            {constructor?.data?.constructor?.pointsHistory?.length > 0 && (
              <Table className="w-full mt-5">
                <TableHead>
                  <TableRow>
                    <TableHeader>Round</TableHeader>
                    <TableHeader>Race</TableHeader>
                    <TableHeader>Session</TableHeader>
                    <TableHeader>Points Scored</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constructor?.data?.constructor?.pointsHistory?.map(
                    (session: {
                      round: number;
                      raceName: string;
                      session: string;
                      points: number;
                    }) => {
                      return (
                        <TableRow>
                          <TableCell> {session?.round}</TableCell>
                          <TableCell>{session?.raceName}</TableCell>
                          <TableCell> {session?.session}</TableCell>
                          <TableCell className="font-semibold">
                            {" "}
                            {session?.points}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            )}

            {constructor?.data?.constructor?.teamPointsHistory?.length > 0 && (
              <Table className="w-full mt-5">
                <TableHead>
                  <TableRow>
                    <TableHeader>Round</TableHeader>
                    <TableHeader>Race</TableHeader>
                    <TableHeader>Session</TableHeader>
                    <TableHeader>Points Scored</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constructor?.data?.constructor?.teamPointsHistory?.map(
                    (session: {
                      round: number;
                      raceName: string;
                      session: string;
                      points: number;
                    }) => {
                      return (
                        <TableRow>
                          <TableCell> {session?.round}</TableCell>
                          <TableCell>{session?.raceName}</TableCell>
                          <TableCell> {session?.session}</TableCell>
                          <TableCell className="font-semibold">
                            {" "}
                            {session?.points}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConstructorModal;
