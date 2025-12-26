import { Board } from "@/components/Board";
import { getAllJobs } from "./actions";

export default async function Home() {
  const jobs = await getAllJobs();

  return <Board initialJobs={jobs} />;
}
