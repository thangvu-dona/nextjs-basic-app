import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/dist/client/router";
import React from "react";

export interface PostPageProps {
  post: any;
}

export default function PostDetailPage({ post }: PostPageProps) {
  const router = useRouter();

  // when fallback in function `getStaticPath` set true, we can do below to improve UX(show Loading...) when data take time for fetching
  if (router.isFallback) {
    return (
      <div
        style={{ fontSize: "2rem", textAlign: "center", fontWeight: "bold" }}
      >
        Loading...
      </div>
    );
  }

  if (!post) return;

  return (
    <div>
      <h1>Post Detail Page</h1>

      <p>{post.author}</p>
      <p>{post.title}</p>
      <p>{post.description}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("\nGET STATIC PATHS");

  const response = await fetch(
    "https://js-post-api.herokuapp.com/api/posts?_page=1 "
  );
  const data = await response.json();

  return {
    paths: data.data.map((post: any) => ({ params: { postId: post.id } })),
    // fallback: false,
    fallback: true, // will render new resource(HTML) if it not available in cache files(SSG)
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async (
  context: GetStaticPropsContext
) => {
  // server-side
  // build time
  console.log("\nGET STATIC PROPS", context.params?.postId);
  const postId = context.params?.postId;
  if (!postId) return { notFound: true };

  const response = await fetch(
    `https://js-post-api.herokuapp.com/api/posts/${postId}`
  );
  const data = await response.json();

  return {
    props: {
      post: data,
    },
    revalidate: 5, // will be update and render(HTML) the page that user acessed to new version in background
  };
};
