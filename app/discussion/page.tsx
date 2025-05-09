"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Link from "next/link";
import Banner2 from "../components/DiscussionPageBanner";
import useAuth from "@/hooks/useAuth";
export default function Discussion() {
  const { isSignedIn, token } = useAuth();
  const [isloading, setloading] = useState(true);
  const [max, setMax] = useState(8);
  const [discussions, setDiscussions] = useState<
    {
      email: string;
      question: string;
      _id: string;
    }[]
  >([]);
  const router = useRouter();

  async function getData() {
    const res = await fetch("/api/discussion/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token || "",
      },
    });
    if (res.status != 200) {
      toast.error("Error getting Discussions");
      setloading(false);
    } else {
      const data = await res.json();
      console.log(data);
      setDiscussions(data);
      setloading(false);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  if (isloading)
    return (
      <center>
        <br />
        <br />
        <br />
        <Loading />
      </center>
    );
  return (
    <main>
      <Banner2 />
      <br /> <br /> <br />
      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
          {discussions.slice(0, max).map((discussion) => (
            <div key={discussion._id} className="h-full">
              <div className={"shadow-lg px-5 pt-5 rounded-3xl  h-full"}>
                <b>Anonymous User</b>
                <br />
                <p className="line-clamp-1 text-ellipsis">
                  <small>{discussion.question}</small>
                </p>
                <br />
                <Link
                  className=" p-2 w-full block text-center hover:bg-slate-50 hover:rounded-2xl transition-all duration-75"
                  href={"/discussion/" + discussion._id}
                >
                  View Discussion
                </Link>
              </div>
              <br />
            </div>
          ))}
        </div>
        <br />
        <br />
        <center>
          {discussions.length > max && (
            <button
              onClick={() => {
                if (discussions.length > max) {
                  setMax(max + 8);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-300 text-white py-4 px-10 rounded-2xl"
            >
              View More
            </button>
          )}
        </center>
      </div>
    </main>
  );
}
