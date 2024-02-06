import Search from "../navbar/search";

export default function MainHero() {
  return (
    <div className="px-6 py-20 w-full max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center">
        Meet the stunning images created by AI
      </h1>
      <h2 className="text-2xl text-center my-4 text-muted-foreground">
        Buy fantastic images and get prompts and files
      </h2>
      <Search />
    </div>
  );
}
