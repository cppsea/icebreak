import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";
import { ENDPOINT } from "./constants";
import PropTypes from "prop-types";

const FeedContext = createContext();

export function FeedProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function getEventsData() {
    try {
      const token = await SecureStore.getValueFor("accessToken");

      const { data: eventsResponse } = await axios.get(
        `${ENDPOINT}/events/pages`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const serializeEvents = eventsResponse.data.events.map((feedEvent) => {
        return {
          ...feedEvent,
          key: feedEvent.eventId,
        };
      });

      setEvents(serializeEvents);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEventsData();
  }, [refreshing]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await getEventsData();
      setRefreshing(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const feedCtx = useMemo(() => ({
    events,
    refreshing,
    onRefresh,
  }));

  return (
    <FeedContext.Provider value={feedCtx}>{children}</FeedContext.Provider>
  );
}

export function useFeedContext() {
  const feedInfo = useContext(FeedContext);
  if (!feedInfo) {
    throw new Error(
      "You are using guild context outside of FeedProvider. Context undefined"
    );
  }
  return feedInfo;
}

FeedProvider.propTypes = {
  children: PropTypes.node,
};
