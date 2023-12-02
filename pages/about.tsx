import Header from "@/components/common/header";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";

// const Header = dynamic(() => import("@/components/common/header"), {
//   ssr: false, // prevent render Header on Server side, only render on Client side
// });

export interface AboutPageProps {}

export default function AboutPage(props: AboutPageProps) {
  const [postList, setPostList] = useState([]);
  const router = useRouter();

  console.log("About query: ", router.query);
  const page = router.query?.page;

  // use Effect only run on client side, not run on server side
  useEffect(() => {
    if (!page) return;

    (async () => {
      const response = await fetch(
        `https://js-post-api.herokuapp.com/api/posts?_page=${page}`
      );
      const data = await response.json();

      setPostList(data.data);
    })();
  }, [page]);

  function handleNextClick() {
    router.push(
      {
        pathname: "/about",
        query: {
          page: (Number(page) || 1) + 1,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <div>
      <h2>About Page</h2>
      <Header />
      <ul className="post-list">
        {postList.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <button onClick={handleNextClick}>Next page</button>
    </div>
  );
}

// SSG
export async function getStaticProps() {
  console.log("get static props");

  return {
    props: {},
  };
}

// turn on server side rendering
// export async function getServerSideProps() {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
