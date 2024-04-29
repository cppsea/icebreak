// const { prismaMock } = require("../prisma_mock");
// const { getPublicUpcomingEvents } = require("../../controllers/events");

// describe("getPublicUpcomingEvents Unit Tests", () => {
//   const testEvents = [
//     {
//       eventId: "eventId1",
//       name: "Event 1",
//       startDate: new Date("2024-04-10"),
//       guilds: {
//         isInviteOnly: false,
//       },
//     },
//     {
//       eventId: "eventId2",
//       name: "Event 2",
//       startDate: new Date("2024-04-15"),
//       guilds: {
//         isInviteOnly: false,
//       },
//     },
//   ];

//   test("should fetch public upcoming events when action is 'next'", async () => {
//     const limit = 10;
//     const eventId = "mockEventID";

//     prismaMock.events.findMany.mockResolvedValue(testEvents);

//     const result = await getPublicUpcomingEvents(limit, eventId);

//     expect(prismaMock.events.findMany).toHaveBeenCalledWith({
//       take: limit,
//       skip: 1,
//       cursor: { eventId: eventId },
//       orderBy: { startDate: "asc" },
//       where: {
//         guilds: { isInviteOnly: false },
//         startDate: { gt: expect.any(Date) },
//       },
//     });

//     expect(result).toEqual(testEvents);
//   });

//   test("should fetch public upcoming events when no action is provided", async () => {
//     const limit = 10;
//     const eventId = undefined;

//     prismaMock.events.findMany.mockResolvedValue(testEvents);

//     const result = await getPublicUpcomingEvents(limit, eventId);

//     expect(prismaMock.events.findMany).toHaveBeenCalledWith({
//       take: limit,
//       orderBy: { startDate: "asc" },
//       where: {
//         guilds: { isInviteOnly: false },
//         startDate: { gt: expect.any(Date) },
//       },
//     });

//     expect(result).toEqual(testEvents);
//   });
// });
