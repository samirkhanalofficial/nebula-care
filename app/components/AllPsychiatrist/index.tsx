"use client";
import React, { Component, useEffect, useState } from "react";

import { toast } from "react-toastify";
import { PsychiatristCard } from "../PsychiatristCard";
import { SearchBox } from "../SearchBox";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../Loading";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AllPsychiatrist({
  isPopularPsychiatrists = false,
}: {
  isPopularPsychiatrists?: boolean;
}) {
  const [isloading, setloading] = useState(true);
  const [max, setMax] = useState(8);
  const searchParams = useSearchParams();
  const search = searchParams?.get("search") ?? "";
  const router = useRouter();
  const [users, setUsers] = useState<
    {
      age: number;
      email: string;
      fullName: string;
      image: string;
      price: string;
      role: string;
      rating: number;
      nmcNumber: string;
      __v: number;
      _id: string;
    }[]
  >([]);
  const { role } = useAuth();

  async function getPsychiatrists() {
    try {
      setloading(true);
      var users = await fetch("/api/get-user/psychiatrists", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await users.json();
      if (users.status == 200) {
        setUsers(data);
      } else {
        throw data.message;
      }
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setloading(false);
    }
  }
  useEffect(() => {
    getPsychiatrists();
  }, []);

  return (
    <div id="courses">
      <div className="mx-auto max-w-7xl sm:py-8 px-4 lg:px-8 ">
        {!isPopularPsychiatrists && (
          <div className="flex justify-between items-center">
            <h3 className="text-midnightblue text-4xl lg:text-55xl font-semibold mb-5 sm:mb-0">
              Our Psychiatrists.
            </h3>
            <div className="w-full md:pl-80">
              <SearchBox defaultValue={search} />
            </div>
          </div>
        )}
        <br />
        {role == "admin" && !isPopularPsychiatrists && (
          <div className="flex items-center justify-end">
            <Link
              className="px-10 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-2xl"
              href="/psychiatrists/add"
            >
              Add Psychiatrist
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users
            .filter((item) =>
              item.fullName
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            )
            .slice(0, max)
            .map((items, i) => (
              <div key={i} className="relative">
                <PsychiatristCard showBest={false} items={items} />
                {role == "admin" && !isPopularPsychiatrists && (
                  <div
                    onClick={async () => {
                      const confirmdelete = confirm(
                        "Are you sure, you want to delete " +
                          items.fullName +
                          " as psychiatrists ?"
                      );
                      if (!confirmdelete) return;
                      const token = await localStorage.getItem("token");
                      var res = await fetch("/api/admin/delete/" + items._id, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          authorization: token || "",
                        },
                      });
                      if (res.status != 200) {
                        toast.error("error deleting psychiatrists");
                      } else {
                        toast.success("deleted psychiatrists");
                        window.location.pathname = "/psychiatrists";
                      }
                    }}
                    className="absolute w-14 cursor-pointer flex items-center justify-center right-0 top-20 text-white opacity-70 shadow-md bg-red hover:opacity-80 active:opacity-100 aspect-square rounded-full"
                  >
                    <TrashIcon width={50} />
                  </div>
                )}
              </div>
            ))}
        </div>
        {isloading && <Loading />}
        {!isloading &&
          users
            .filter((item) =>
              item.fullName
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            )
            .slice(0, max).length == 0 && (
            <center>
              <br />
              <br />
              <br />
              <br />
              <br />
              <h2 className="font-bold">No Psychiatrist Found</h2>
              The search result for your query is Empty.
            </center>
          )}

        <center>
          {users.filter((item) =>
            item.fullName
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
          ).length > max && (
            <button
              onClick={() => {
                if (
                  users.filter((item) =>
                    item.fullName
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ).length > max
                ) {
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
    </div>
  );
}
