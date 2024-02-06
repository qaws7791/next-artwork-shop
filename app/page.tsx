import ArtworkList from "@/components/artwork-list";
import MainHero from "@/components/layout/hero/main-hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-4">
      <MainHero />
      <main>
        <ArtworkList />
      </main>
    </div>
  );
}
