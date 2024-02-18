import AddBoard from "@/components/AddBoard";
import Navbar from "@/components/Navbar";
import TopicsList from "@/components/TopicsList";

export default function Home() {
  return <>
    <Navbar />
    <TopicsList />
    <AddBoard />
  </>;
}
