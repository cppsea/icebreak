const prisma = require("../prisma/prisma");

async function getAllEvents() {
  return prisma.event.findMany();
}

async function getEvents(limit, action, eventId) {
  let events;

  switch (action) {
    case "prev":
      events = await prisma.events.findMany({
        take: -1 * limit,
        skip: 1, // skip cursor (TODO: check if skip 1 is needed for previous page queries)
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    case "next":
      events = await prisma.events.findMany({
        take: limit,
        skip: 1, // skip cursor
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    // first request made for first page, no action in cursor present
    default:
      events = await prisma.events.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  return events;
}

async function getPages(limit) {
  const totalEvents = await prisma.events.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function createEvent(eventData, guildId) {
  const newEvent = await prisma.events.create({
    data: {
      guildId: guildId,
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      thumbnail: eventData.thumbnail,
    },
  });
  return newEvent;
}

async function getEvent(eventId) {
  return prisma.events.findUniqueOrThrow({
    where: {
      eventId: eventId,
    },
  });
}

async function deleteEvent(eventId) {
  const deletedEvent = await prisma.events.delete({
    where: {
      eventId: eventId,
    },
  });
  return deletedEvent;
}

async function updateEvent(eventId, eventData) {
  const updateEvent = await prisma.events.update({
    where: {
      eventId: eventId,
    },
    //If a given data was not updated, it will be undefined and prisma will ignore the update of that field
    data: {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      thumbnail: eventData.thumbnail,
    },
  });
  return updateEvent;
}

async function getEventAttendees(eventId) {
  const query = await prisma.users.findMany({
    where: {
      eventAttendees: {
        some: {
          eventId: eventId,
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });
  return query;
}

async function updateAttendeeStatus(eventId, userId, attendeeStatus) {
  const query = await prisma.eventAttendees.update({
    where: {
      userId_eventId: {
        userId: userId,
        eventId: eventId,
      },
    },
    data: {
      status: attendeeStatus,
    },
  });

  return query;
}

module.exports = {
  getEvent,
  getEvents,
  getPages,
  getAllEvents,
  deleteEvent,
  updateEvent,
  createEvent,
  getEventAttendees,
  updateAttendeeStatus,
};
