import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import HashLoader from "react-spinners/HashLoader";
import { RxCross2 } from "react-icons/rx";
import { FaUserAlt } from "react-icons/fa";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";

const DriverModal = ({
  driverId,
  isModalOpen,
  closeModal,
}: {
  driverId: string;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const {
    data: driver,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-drivers-stats", {
        driverId,
      });
    },
    enabled: !!driverId,
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

      {error && <p className="text-center">Could not fetch Driver data!</p>}

      {driver?.data?.driver && (
        <>
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          {/* Driver Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Driver Image Section */}
              <div
                className="h-full w-full flex items-end justify-center pt-5"
                style={{
                  backgroundImage: `linear-gradient(${driver?.data?.driver?.constructor_color},#000)`,
                }}
              >
                {driver?.data?.driver?.image ? (
                  <img
                    src={driver?.data?.driver.image}
                    alt={driver?.data?.driver.familyName}
                    className="h-52 object-cover"
                  />
                ) : (
                  <FaUserAlt className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
            <div className="w-full md:flex-1 border-b-4 border-black">
              {/* Driver Data */}
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="text-2xl text-ellipsis text-nowrap font-semibold">
                  {driver?.data?.driver?.givenName}{" "}
                  {driver?.data?.driver?.familyName} (
                  {driver?.data?.driver?.code})
                </h3>
                <p className="text-xl">
                  Driver Number : #{driver?.data?.driver?.permanentNumber}
                </p>
                <p className="text-lg text-darkbg/70 dark:text-white/50">
                  {driver?.data?.driver?.constructor_name}
                </p>
                <p className="text-md">
                  {driver?.data?.driver?.points
                    ? "Points"
                    : "Points scored for you"}
                  :{" "}
                  <span className="font-semibold">
                    {driver?.data?.driver?.points
                      ? driver?.data?.driver?.points
                      : driver?.data?.driver?.pointsForTeam}
                  </span>
                </p>
                <p className="text-md">
                  Price:{" "}
                  <span className="font-semibold">
                    {driver?.data?.driver?.price} Cr.
                  </span>
                </p>
                {driver?.data?.driver?.chosenPercentage && (
                  <p className="text-md">
                    Teams in which driver is present:{" "}
                    <span className="font-semibold">
                      {Number(driver?.data?.driver?.chosenPercentage).toFixed(
                        0
                      )}
                      %{" "}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
            <p className="text-xl font-medium">
              {driver?.data?.driver?.pointsHistory?.length > 0
                ? "Points Scored"
                : "Points Scored for you"}
              :{" "}
            </p>

            {driver?.data?.driver?.pointsHistory?.length > 0 && (
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
                  {driver?.data?.driver?.pointsHistory?.map(
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

            {driver?.data?.driver?.teamPointsHistory?.length > 0 && (
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
                  {driver?.data?.driver?.teamPointsHistory?.map(
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

export default DriverModal;
