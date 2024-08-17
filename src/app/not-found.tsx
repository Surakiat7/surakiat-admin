"use client";

import React, { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/authContext";
import { getAccessToken } from "@/utils/token";
import Loading from "@/components/loading";
import { useNavigate } from "@/utils/navigation";

type Props = {};

const NotFound = ({}: Props) => {
  const navigateTo = useNavigate();
  const auth = useAuth();
  const { userProfile } = auth;

  const isUserAuthenticated = useCallback(async () => {
    if ((await getAccessToken()) && userProfile) {
      navigateTo.Blog();
    } else {
      navigateTo.Blog();
    }
  }, [navigateTo, userProfile]);

  useEffect(() => {
    if (userProfile !== undefined) {
      isUserAuthenticated();
    }
  }, [userProfile, isUserAuthenticated]);

  return <Loading />;
};

export default NotFound;