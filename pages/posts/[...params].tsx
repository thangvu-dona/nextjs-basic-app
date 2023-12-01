import { useRouter } from "next/dist/client/router";
import React from "react";

export interface PostParamsPageProps {}

export default function PostParamsPage(props: PostParamsPageProps) {
  const router = useRouter();

  return (
    <div>
      <h1>Post Params Page</h1>

      <p>Query: {JSON.stringify(router.query)}</p>
    </div>
  );
}
