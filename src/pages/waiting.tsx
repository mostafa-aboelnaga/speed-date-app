import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import { Button, Form, Input } from "react-daisyui";
import { useAtom } from "jotai";
import { userIdAtom } from "./index";
import { useEffect } from "react";
import { useRouter } from "next/router";

type RegisterForm = {
  name: string;
  contactInfo: string;
};

const WaitingPage: NextPage = () => {
  const [userId, setUserId] = useAtom(userIdAtom);
  const startDateQuery = trpc.useQuery(["users.startDate", { userId }]);
  const getMyDateQuery = trpc.useQuery(["users.getMyDate", { userId }]);
  const router = useRouter();

  useEffect(() => {
    const date = startDateQuery.data;
    if (date) {
      router.push(`/chatting/${date.id}`);
    }
  }, [startDateQuery.data]);

  useEffect(() => {
    const date = getMyDateQuery.data;
    if (date) {
      router.push(`/chatting/${date.id}`);
    }
  }, [getMyDateQuery.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMyDateQuery.refetch();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [getMyDateQuery]);

  return (
    <>
      <Head>
        <title>Waiting for Users</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col gap-6 items-center justify-center min-h-screen p-4">
        <h3 className="text-xl">Waiting for Users to Connect With...</h3>
        <div>
          <img src="/puff.svg" />
        </div>
      </main>
    </>
  );
};

export default WaitingPage;
