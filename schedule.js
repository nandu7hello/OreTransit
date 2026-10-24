// Official Ore Cart time-point schedules, transcribed from orecart.mines.edu
// (Gold, Tungsten and Silver route schedule pages, October 2026).
// Each row is one trip; columns follow the route's stop order in data.js.
// null = "no set time" (the shuttle serves the stop, but no time is posted;
// the app estimates it from the neighbouring timed stops).
// Service hours: 7:00 AM – 6:30 PM Mon–Fri, 8:00 AM – 5:00 PM Sat & Sun.
// No service on Colorado School of Mines campus closures.

const _ = null;

export const SCHEDULE = {
  gold: {
    weekday: [
      ["7:00 AM", _, "7:03 AM", _, _, "7:09 AM", _, "7:13 AM", _, "7:19 AM", _, "7:22 AM", _, "7:25 AM", _],
      ["7:30 AM", _, "7:33 AM", _, _, "7:39 AM", _, "7:43 AM", _, "7:49 AM", _, "7:52 AM", _, "7:55 AM", _],
      ["8:00 AM", _, "8:03 AM", _, _, "8:09 AM", _, "8:13 AM", _, "8:19 AM", _, "8:22 AM", _, "8:25 AM", _],
      ["8:17 AM", _, "8:20 AM", _, _, "8:26 AM", _, "8:30 AM", _, "8:36 AM", _, "8:39 AM", _, "8:42 AM", _],
      ["8:33 AM", _, "8:36 AM", _, _, "8:42 AM", _, "8:46 AM", _, "8:52 AM", _, "8:55 AM", _, "8:58 AM", _],
      ["8:50 AM", _, "8:53 AM", _, _, "8:59 AM", _, "9:03 AM", _, "9:09 AM", _, "9:12 AM", _, "9:15 AM", _],
      ["9:06 AM", _, "9:09 AM", _, _, "9:15 AM", _, "9:19 AM", _, "9:25 AM", _, "9:28 AM", _, "9:31 AM", _],
      ["9:23 AM", _, "9:26 AM", _, _, "9:32 AM", _, "9:36 AM", _, "9:42 AM", _, "9:45 AM", _, "9:48 AM", _],
      ["9:39 AM", _, "9:42 AM", _, _, "9:48 AM", _, "9:52 AM", _, "9:58 AM", _, "10:01 AM", _, "10:04 AM", _],
      ["9:56 AM", _, "9:59 AM", _, _, "10:05 AM", _, "10:09 AM", _, "10:15 AM", _, "10:18 AM", _, "10:21 AM", _],
      ["10:12 AM", _, "10:15 AM", _, _, "10:21 AM", _, "10:25 AM", _, "10:31 AM", _, "10:34 AM", _, "10:37 AM", _],
      ["10:29 AM", _, "10:32 AM", _, _, "10:38 AM", _, "10:42 AM", _, "10:48 AM", _, "10:51 AM", _, "10:54 AM", _],
      ["10:45 AM", _, "10:48 AM", _, _, "10:54 AM", _, "10:58 AM", _, "11:04 AM", _, "11:07 AM", _, "11:10 AM", _],
      ["11:02 AM", _, "11:05 AM", _, _, "11:11 AM", _, "11:15 AM", _, "11:21 AM", _, "11:24 AM", _, "11:27 AM", _],
      ["11:18 AM", _, "11:21 AM", _, _, "11:27 AM", _, "11:31 AM", _, "11:37 AM", _, "11:40 AM", _, "11:43 AM", _],
      ["11:35 AM", _, "11:38 AM", _, _, "11:44 AM", _, "11:48 AM", _, "11:54 AM", _, "11:57 AM", _, "12:00 PM", _],
      ["11:51 AM", _, "11:54 AM", _, _, "12:00 PM", _, "12:04 PM", _, "12:10 PM", _, "12:13 PM", _, "12:16 PM", _],
      ["12:08 PM", _, "12:11 PM", _, _, "12:17 PM", _, "12:21 PM", _, "12:27 PM", _, "12:30 PM", _, "12:33 PM", _],
      ["12:24 PM", _, "12:27 PM", _, _, "12:33 PM", _, "12:37 PM", _, "12:43 PM", _, "12:46 PM", _, "12:49 PM", _],
      ["12:41 PM", _, "12:44 PM", _, _, "12:50 PM", _, "12:54 PM", _, "1:00 PM", _, "1:03 PM", _, "1:06 PM", _],
      ["12:57 PM", _, "1:00 PM", _, _, "1:06 PM", _, "1:10 PM", _, "1:16 PM", _, "1:19 PM", _, "1:22 PM", _],
      ["1:14 PM", _, "1:17 PM", _, _, "1:23 PM", _, "1:27 PM", _, "1:33 PM", _, "1:36 PM", _, "1:39 PM", _],
      ["1:30 PM", _, "1:33 PM", _, _, "1:39 PM", _, "1:43 PM", _, "1:49 PM", _, "1:52 PM", _, "1:55 PM", _],
      ["1:47 PM", _, "1:50 PM", _, _, "1:56 PM", _, "2:00 PM", _, "2:06 PM", _, "2:09 PM", _, "2:12 PM", _],
      ["2:03 PM", _, "2:06 PM", _, _, "2:12 PM", _, "2:16 PM", _, "2:22 PM", _, "2:25 PM", _, "2:28 PM", _],
      ["2:20 PM", _, "2:23 PM", _, _, "2:29 PM", _, "2:33 PM", _, "2:39 PM", _, "2:42 PM", _, "2:45 PM", _],
      ["2:36 PM", _, "2:39 PM", _, _, "2:45 PM", _, "2:49 PM", _, "2:55 PM", _, "2:58 PM", _, "3:01 PM", _],
      ["2:53 PM", _, "2:56 PM", _, _, "3:02 PM", _, "3:06 PM", _, "3:12 PM", _, "3:15 PM", _, "3:18 PM", _],
      ["3:09 PM", _, "3:12 PM", _, _, "3:18 PM", _, "3:22 PM", _, "3:28 PM", _, "3:31 PM", _, "3:34 PM", _],
      ["3:26 PM", _, "3:29 PM", _, _, "3:35 PM", _, "3:39 PM", _, "3:45 PM", _, "3:48 PM", _, "3:51 PM", _],
      ["3:42 PM", _, "3:45 PM", _, _, "3:51 PM", _, "3:55 PM", _, "4:01 PM", _, "4:04 PM", _, "4:07 PM", _],
      ["3:59 PM", _, "4:02 PM", _, _, "4:08 PM", _, "4:12 PM", _, "4:18 PM", _, "4:21 PM", _, "4:24 PM", _],
      ["4:15 PM", _, "4:18 PM", _, _, "4:24 PM", _, "4:28 PM", _, "4:34 PM", _, "4:37 PM", _, "4:40 PM", _],
      ["4:32 PM", _, "4:35 PM", _, _, "4:41 PM", _, "4:45 PM", _, "4:51 PM", _, "4:54 PM", _, "4:57 PM", _],
      ["4:48 PM", _, "4:51 PM", _, _, "4:57 PM", _, "5:01 PM", _, "5:07 PM", _, "5:10 PM", _, "5:13 PM", _],
      ["5:05 PM", _, "5:08 PM", _, _, "5:14 PM", _, "5:18 PM", _, "5:24 PM", _, "5:27 PM", _, "5:30 PM", _],
      ["5:21 PM", _, "5:24 PM", _, _, "5:30 PM", _, "5:34 PM", _, "5:40 PM", _, "5:43 PM", _, "5:46 PM", _],
      ["5:38 PM", _, "5:41 PM", _, _, "5:47 PM", _, "5:51 PM", _, "5:57 PM", _, "6:00 PM", _, "6:03 PM", _],
      ["5:54 PM", _, "5:57 PM", _, _, "6:03 PM", _, "6:07 PM", _, "6:13 PM", _, "6:16 PM", _, "6:19 PM", _],
      ["6:15 PM", _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      ["6:30 PM", _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ],
    weekend: [
      ["8:00 AM", _, "8:03 AM", _, _, "8:09 AM", _, "8:13 AM", _, "8:19 AM", _, "8:22 AM", _, "8:25 AM", _],
      ["8:33 AM", _, "8:36 AM", _, _, "8:42 AM", _, "8:46 AM", _, "8:52 AM", _, "8:55 AM", _, "8:58 AM", _],
      ["9:06 AM", _, "9:09 AM", _, _, "9:15 AM", _, "9:19 AM", _, "9:25 AM", _, "9:28 AM", _, "9:31 AM", _],
      ["9:39 AM", _, "9:42 AM", _, _, "9:48 AM", _, "9:52 AM", _, "9:58 AM", _, "10:01 AM", _, "10:04 AM", _],
      ["10:12 AM", _, "10:15 AM", _, _, "10:21 AM", _, "10:25 AM", _, "10:31 AM", _, "10:34 AM", _, "10:37 AM", _],
      ["10:45 AM", _, "10:48 AM", _, _, "10:54 AM", _, "10:58 AM", _, "11:04 AM", _, "11:07 AM", _, "11:10 AM", _],
      ["11:18 AM", _, "11:21 AM", _, _, "11:27 AM", _, "11:31 AM", _, "11:37 AM", _, "11:40 AM", _, "11:43 AM", _],
      ["11:51 AM", _, "11:54 AM", _, _, "12:00 PM", _, "12:04 PM", _, "12:10 PM", _, "12:13 PM", _, "12:16 PM", _],
      ["12:24 PM", _, "12:27 PM", _, _, "12:33 PM", _, "12:37 PM", _, "12:43 PM", _, "12:46 PM", _, "12:49 PM", _],
      ["12:57 PM", _, "1:00 PM", _, _, "1:06 PM", _, "1:10 PM", _, "1:16 PM", _, "1:19 PM", _, "1:22 PM", _],
      ["1:30 PM", _, "1:33 PM", _, _, "1:39 PM", _, "1:43 PM", _, "1:49 PM", _, "1:52 PM", _, "1:55 PM", _],
      ["2:03 PM", _, "2:06 PM", _, _, "2:12 PM", _, "2:16 PM", _, "2:22 PM", _, "2:25 PM", _, "2:28 PM", _],
      ["2:36 PM", _, "2:39 PM", _, _, "2:45 PM", _, "2:49 PM", _, "2:55 PM", _, "2:58 PM", _, "3:01 PM", _],
      ["3:09 PM", _, "3:12 PM", _, _, "3:18 PM", _, "3:22 PM", _, "3:28 PM", _, "3:31 PM", _, "3:34 PM", _],
      ["3:42 PM", _, "3:45 PM", _, _, "3:51 PM", _, "3:55 PM", _, "4:01 PM", _, "4:04 PM", _, "4:07 PM", _],
      ["4:15 PM", _, "4:18 PM", _, _, "4:24 PM", _, "4:28 PM", _, "4:34 PM", _, "4:37 PM", _, "4:40 PM", _],
      ["5:00 PM", _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ],
  },

  tungsten: {
    weekday: [
      ["7:00 AM", _, _, "7:17 AM", _, "7:22 AM", "7:25 AM", _, "7:30 AM"],
      ["7:35 AM", _, _, "7:47 AM", _, "7:52 AM", "7:55 AM", _, "8:00 AM"],
      ["8:05 AM", _, _, "8:17 AM", _, "8:22 AM", "8:25 AM", _, "8:30 AM"],
      ["8:20 AM", _, _, "8:32 AM", _, "8:37 AM", "8:40 AM", _, "8:45 AM"],
      ["8:35 AM", _, _, "8:49 AM", _, "8:54 AM", "8:57 AM", _, "9:02 AM"],
      ["8:50 AM", _, _, "9:04 AM", _, "9:09 AM", "9:12 AM", _, "9:17 AM"],
      ["9:05 AM", _, _, "9:19 AM", _, "9:24 AM", "9:27 AM", _, "9:32 AM"],
      ["9:20 AM", _, _, "9:34 AM", _, "9:39 AM", "9:42 AM", _, "9:47 AM"],
      ["9:35 AM", _, _, "9:49 AM", _, "9:54 AM", "9:57 AM", _, "10:02 AM"],
      ["9:50 AM", _, _, "10:04 AM", _, "10:09 AM", "10:12 AM", _, "10:17 AM"],
      ["10:05 AM", _, _, "10:19 AM", _, "10:24 AM", "10:27 AM", _, "10:32 AM"],
      ["10:20 AM", _, _, "10:34 AM", _, "10:39 AM", "10:42 AM", _, "10:47 AM"],
      ["10:35 AM", _, _, "10:49 AM", _, "10:54 AM", "10:57 AM", _, "11:02 AM"],
      ["10:50 AM", _, _, "11:04 AM", _, "11:09 AM", "11:12 AM", _, "11:17 AM"],
      ["11:05 AM", _, _, "11:19 AM", _, "11:24 AM", "11:27 AM", _, "11:32 AM"],
      ["11:20 AM", _, _, "11:34 AM", _, "11:39 AM", "11:42 AM", _, "11:47 AM"],
      ["11:35 AM", _, _, "11:49 AM", _, "11:54 AM", "11:57 AM", _, "12:02 PM"],
      ["11:50 AM", _, _, "12:04 PM", _, "12:09 PM", "12:12 PM", _, "12:17 PM"],
      ["12:05 PM", _, _, "12:19 PM", _, "12:24 PM", "12:27 PM", _, "12:32 PM"],
      ["12:20 PM", _, _, "12:34 PM", _, "12:39 PM", "12:42 PM", _, "12:47 PM"],
      ["12:35 PM", _, _, "12:49 PM", _, "12:54 PM", "12:57 PM", _, "1:02 PM"],
      ["12:50 PM", _, _, "1:04 PM", _, "1:09 PM", "1:12 PM", _, "1:17 PM"],
      ["1:05 PM", _, _, "1:19 PM", _, "1:24 PM", "1:27 PM", _, "1:32 PM"],
      ["1:20 PM", _, _, "1:34 PM", _, "1:39 PM", "1:42 PM", _, "1:47 PM"],
      ["1:35 PM", _, _, "1:49 PM", _, "1:54 PM", "1:57 PM", _, "2:02 PM"],
      ["1:50 PM", _, _, "2:04 PM", _, "2:09 PM", "2:12 PM", _, "2:17 PM"],
      ["2:05 PM", _, _, "2:19 PM", _, "2:24 PM", "2:27 PM", _, "2:32 PM"],
      ["2:20 PM", _, _, "2:34 PM", _, "2:39 PM", "2:42 PM", _, "2:47 PM"],
      ["2:35 PM", _, _, "2:49 PM", _, "2:54 PM", "2:57 PM", _, "3:02 PM"],
      ["2:50 PM", _, _, "3:04 PM", _, "3:09 PM", "3:12 PM", _, "3:17 PM"],
      ["3:05 PM", _, _, "3:19 PM", _, "3:24 PM", "3:27 PM", _, "3:32 PM"],
      ["3:20 PM", _, _, "3:34 PM", _, "3:39 PM", "3:42 PM", _, "3:47 PM"],
      ["3:35 PM", _, _, "3:49 PM", _, "3:54 PM", "3:57 PM", _, "4:02 PM"],
      ["3:50 PM", _, _, "4:04 PM", _, "4:09 PM", "4:12 PM", _, "4:17 PM"],
      ["4:05 PM", _, _, "4:19 PM", _, "4:24 PM", "4:27 PM", _, "4:32 PM"],
      ["4:20 PM", _, _, "4:34 PM", _, "4:39 PM", "4:42 PM", _, "4:47 PM"],
      ["4:35 PM", _, _, "4:49 PM", _, "4:54 PM", "4:57 PM", _, "5:02 PM"],
      ["4:50 PM", _, _, "5:04 PM", _, "5:09 PM", "5:12 PM", _, "5:17 PM"],
      ["5:05 PM", _, _, "5:19 PM", _, "5:24 PM", "5:27 PM", _, "5:32 PM"],
      ["5:20 PM", _, _, "5:34 PM", _, "5:39 PM", "5:42 PM", _, "5:47 PM"],
      ["5:35 PM", _, _, "5:47 PM", _, "5:52 PM", "5:55 PM", _, "6:00 PM"],
      ["5:50 PM", _, _, "6:02 PM", _, "6:07 PM", "6:10 PM", _, "6:15 PM"],
      ["6:05 PM", _, _, "6:15 PM", _, _, _, _, _],
      ["6:18 PM", _, _, "6:30 PM", _, _, _, _, _],
    ],
    weekend: [
      [_, _, _, "8:00 AM", _, "8:05 AM", "8:08 AM", _, "8:13 AM"],
      ["8:20 AM", _, _, "8:34 AM", _, "8:39 AM", "8:42 AM", _, "8:47 AM"],
      ["8:50 AM", _, _, "9:04 AM", _, "9:09 AM", "9:12 AM", _, "9:17 AM"],
      ["9:20 AM", _, _, "9:34 AM", _, "9:39 AM", "9:42 AM", _, "9:47 AM"],
      ["9:50 AM", _, _, "10:04 AM", _, "10:09 AM", "10:12 AM", _, "10:17 AM"],
      ["10:20 AM", _, _, "10:34 AM", _, "10:39 AM", "10:42 AM", _, "10:47 AM"],
      ["10:50 AM", _, _, "11:04 AM", _, "11:09 AM", "11:12 AM", _, "11:17 AM"],
      ["11:20 AM", _, _, "11:34 AM", _, "11:39 AM", "11:42 AM", _, "11:47 AM"],
      ["11:50 AM", _, _, "12:04 PM", _, "12:09 PM", "12:12 PM", _, "12:17 PM"],
      ["12:20 PM", _, _, "12:34 PM", _, "12:39 PM", "12:42 PM", _, "12:47 PM"],
      ["12:50 PM", _, _, "1:04 PM", _, "1:09 PM", "1:12 PM", _, "1:17 PM"],
      ["1:20 PM", _, _, "1:34 PM", _, "1:39 PM", "1:42 PM", _, "1:47 PM"],
      ["1:50 PM", _, _, "2:04 PM", _, "2:09 PM", "2:12 PM", _, "2:17 PM"],
      ["2:20 PM", _, _, "2:34 PM", _, "2:39 PM", "2:42 PM", _, "2:47 PM"],
      ["2:50 PM", _, _, "3:04 PM", _, "3:09 PM", "3:12 PM", _, "3:17 PM"],
      ["3:20 PM", _, _, "3:34 PM", _, "3:39 PM", "3:42 PM", _, "3:47 PM"],
      ["3:50 PM", _, _, "4:04 PM", _, "4:09 PM", "4:12 PM", _, "4:17 PM"],
      ["4:20 PM", _, _, "4:34 PM", _, "4:39 PM", "4:42 PM", _, "4:47 PM"],
      ["4:50 PM", _, _, "5:00 PM", _, _, _, _, _],
    ],
  },

  silver: {
    weekday: [
      ["7:00 AM", _, "7:04 AM", _, "7:12 AM", _, "7:20 AM", _, "7:24 AM"],
      ["7:27 AM", _, "7:31 AM", _, "7:39 AM", _, "7:47 AM", _, "7:51 AM"],
      ["7:54 AM", _, "7:58 AM", _, "8:06 AM", _, "8:14 AM", _, "8:18 AM"],
      ["8:09 AM", _, "8:13 AM", _, "8:21 AM", _, "8:29 AM", _, "8:33 AM"],
      ["8:21 AM", _, "8:25 AM", _, "8:33 AM", _, "8:41 AM", _, "8:45 AM"],
      ["8:36 AM", _, "8:40 AM", _, "8:48 AM", _, "8:56 AM", _, "9:00 AM"],
      ["8:48 AM", _, "8:52 AM", _, "9:00 AM", _, "9:11 AM", _, "9:15 AM"],
      ["9:03 AM", _, "9:07 AM", _, "9:15 AM", _, "9:26 AM", _, "9:30 AM"],
      ["9:18 AM", _, "9:22 AM", _, "9:30 AM", _, "9:41 AM", _, "9:45 AM"],
      ["9:33 AM", _, "9:37 AM", _, "9:45 AM", _, "9:56 AM", _, "10:00 AM"],
      ["9:48 AM", _, "9:52 AM", _, "10:00 AM", _, "10:11 AM", _, "10:15 AM"],
      ["10:03 AM", _, "10:07 AM", _, "10:15 AM", _, "10:26 AM", _, "10:30 AM"],
      ["10:18 AM", _, "10:22 AM", _, "10:30 AM", _, "10:41 AM", _, "10:45 AM"],
      ["10:33 AM", _, "10:37 AM", _, "10:45 AM", _, "10:56 AM", _, "11:00 AM"],
      ["10:48 AM", _, "10:52 AM", _, "11:00 AM", _, "11:11 AM", _, "11:15 AM"],
      ["11:03 AM", _, "11:07 AM", _, "11:15 AM", _, "11:26 AM", _, "11:30 AM"],
      ["11:18 AM", _, "11:22 AM", _, "11:30 AM", _, "11:41 AM", _, "11:45 AM"],
      ["11:33 AM", _, "11:37 AM", _, "11:45 AM", _, "11:56 AM", _, "12:00 PM"],
      ["11:48 AM", _, "11:52 AM", _, "12:00 PM", _, "12:11 PM", _, "12:15 PM"],
      ["12:03 PM", _, "12:07 PM", _, "12:15 PM", _, "12:26 PM", _, "12:30 PM"],
      ["12:18 PM", _, "12:22 PM", _, "12:30 PM", _, "12:41 PM", _, "12:45 PM"],
      ["12:33 PM", _, "12:37 PM", _, "12:45 PM", _, "12:56 PM", _, "1:00 PM"],
      ["12:48 PM", _, "12:52 PM", _, "1:00 PM", _, "1:11 PM", _, "1:15 PM"],
      ["1:03 PM", _, "1:10 PM", _, "1:18 PM", _, "1:26 PM", _, "1:30 PM"],
      ["1:18 PM", _, "1:25 PM", _, "1:33 PM", _, "1:41 PM", _, "1:45 PM"],
      ["1:33 PM", _, "1:40 PM", _, "1:48 PM", _, "1:56 PM", _, "2:00 PM"],
      ["1:48 PM", _, "1:55 PM", _, "2:03 PM", _, "2:11 PM", _, "2:15 PM"],
      ["2:03 PM", _, "2:10 PM", _, "2:18 PM", _, "2:26 PM", _, "2:30 PM"],
      ["2:18 PM", _, "2:25 PM", _, "2:33 PM", _, "2:41 PM", _, "2:45 PM"],
      ["2:33 PM", _, "2:40 PM", _, "2:48 PM", _, "2:56 PM", _, "3:00 PM"],
      ["2:48 PM", _, "2:55 PM", _, "3:03 PM", _, "3:11 PM", _, "3:15 PM"],
      ["3:03 PM", _, "3:10 PM", _, "3:18 PM", _, "3:26 PM", _, "3:30 PM"],
      ["3:18 PM", _, "3:25 PM", _, "3:33 PM", _, "3:41 PM", _, "3:45 PM"],
      ["3:33 PM", _, "3:40 PM", _, "3:48 PM", _, "3:56 PM", _, "4:00 PM"],
      ["3:48 PM", _, "3:55 PM", _, "4:03 PM", _, "4:11 PM", _, "4:15 PM"],
      ["4:03 PM", _, "4:10 PM", _, "4:18 PM", _, "4:26 PM", _, "4:30 PM"],
      ["4:18 PM", _, "4:25 PM", _, "4:33 PM", _, "4:41 PM", _, "4:45 PM"],
      ["4:33 PM", _, "4:40 PM", _, "4:48 PM", _, "4:56 PM", _, "5:00 PM"],
      ["4:48 PM", _, "4:55 PM", _, "5:03 PM", _, "5:11 PM", _, "5:15 PM"],
      ["5:03 PM", _, "5:07 PM", _, "5:15 PM", _, "5:23 PM", _, "5:27 PM"],
      ["5:15 PM", _, "5:19 PM", _, "5:27 PM", _, "5:35 PM", _, "5:39 PM"],
      ["5:30 PM", _, "5:34 PM", _, "5:42 PM", _, "5:50 PM", _, "5:54 PM"],
      ["5:42 PM", _, "5:46 PM", _, "5:54 PM", _, "6:02 PM", _, "6:06 PM"],
      ["5:57 PM", _, "6:01 PM", _, "6:09 PM", _, "6:15 PM", _, _],
      ["6:09 PM", _, "6:13 PM", _, "6:21 PM", _, "6:30 PM", _, _],
    ],
    weekend: [
      ["8:00 AM", _, "8:04 AM", _, "8:12 AM", _, "8:23 AM", _, "8:27 AM"],
      ["8:30 AM", _, "8:34 AM", _, "8:42 AM", _, "8:53 AM", _, "8:57 AM"],
      ["9:00 AM", _, "9:04 AM", _, "9:12 AM", _, "9:23 AM", _, "9:27 AM"],
      ["9:30 AM", _, "9:34 AM", _, "9:42 AM", _, "9:53 AM", _, "9:57 AM"],
      ["10:00 AM", _, "10:04 AM", _, "10:12 AM", _, "10:23 AM", _, "10:27 AM"],
      ["10:30 AM", _, "10:34 AM", _, "10:42 AM", _, "10:53 AM", _, "10:57 AM"],
      ["11:00 AM", _, "11:04 AM", _, "11:12 AM", _, "11:23 AM", _, "11:27 AM"],
      ["11:30 AM", _, "11:34 AM", _, "11:42 AM", _, "11:53 AM", _, "11:57 AM"],
      ["12:00 PM", _, "12:04 PM", _, "12:12 PM", _, "12:23 PM", _, "12:27 PM"],
      ["12:30 PM", _, "12:34 PM", _, "12:42 PM", _, "12:53 PM", _, "12:57 PM"],
      ["1:00 PM", _, "1:04 PM", _, "1:12 PM", _, "1:23 PM", _, "1:27 PM"],
      ["1:30 PM", _, "1:34 PM", _, "1:42 PM", _, "1:53 PM", _, "1:57 PM"],
      ["2:00 PM", _, "2:04 PM", _, "2:12 PM", _, "2:23 PM", _, "2:27 PM"],
      ["2:30 PM", _, "2:34 PM", _, "2:42 PM", _, "2:53 PM", _, "2:57 PM"],
      ["3:00 PM", _, "3:04 PM", _, "3:12 PM", _, "3:20 PM", _, "3:24 PM"],
      ["3:27 PM", _, "3:31 PM", _, "3:39 PM", _, "3:47 PM", _, "3:51 PM"],
      ["3:54 PM", _, "3:58 PM", _, "4:06 PM", _, "4:14 PM", _, "4:18 PM"],
      ["4:21 PM", _, "4:25 PM", _, "4:33 PM", _, "4:41 PM", _, "4:45 PM"],
      ["4:48 PM", _, "4:52 PM", _, "5:00 PM", _, _, _, _],
    ],
  },
};

export const SERVICE_HOURS = {
  weekday: "7:00 AM – 6:30 PM",
  weekend: "8:00 AM – 5:00 PM",
};

export const SCHEDULE_SOURCE = "https://orecart.mines.edu/";

/* ---------- helpers ---------- */

export function toMinutes(time) {
  if (!time) return null;
  const [clock, period] = time.split(" ");
  const [h, m] = clock.split(":").map(Number);
  return ((h % 12) + (period === "PM" ? 12 : 0)) * 60 + m;
}

export function fromMinutes(total) {
  const t = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  return `${h % 12 || 12}:${String(t % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function serviceDay(date = new Date()) {
  const d = date.getDay();
  return d === 0 || d === 6 ? "weekend" : "weekday";
}

// Current minutes-since-midnight in Golden, CO (America/Denver), regardless of the phone's zone.
export function nowInGolden(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  const weekday = get("weekday");
  return { minutes: hour * 60 + minute, day: weekday === "Sat" || weekday === "Sun" ? "weekend" : "weekday" };
}

// Fill "no set time" cells by interpolating between the nearest timed stops on the same trip.
// Returns an array of {minutes, estimated} (or null when the trip ends before that stop).
export function tripTimes(row) {
  const mins = row.map(toMinutes);
  const out = mins.map((m) => (m === null ? null : { minutes: m, estimated: false }));
  for (let i = 0; i < mins.length; i++) {
    if (mins[i] !== null) continue;
    let prev = i - 1;
    while (prev >= 0 && mins[prev] === null) prev--;
    let next = i + 1;
    while (next < mins.length && mins[next] === null) next++;
    if (prev < 0 || next >= mins.length) continue; // before first / after last timed stop: trip not timed here
    const span = next - prev;
    const minutes = Math.round(mins[prev] + ((mins[next] - mins[prev]) * (i - prev)) / span);
    out[i] = { minutes, estimated: true };
  }
  return out;
}

// All departures from one stop on one route for a given service day, in order.
export function departuresAt(routeKey, stopIndex, day) {
  const rows = SCHEDULE[routeKey]?.[day] ?? [];
  return rows.map(tripTimes).map((t) => t[stopIndex]).filter(Boolean);
}

// Next few departures from a stop after `nowMinutes`.
export function nextDepartures(routeKey, stopIndex, day, nowMinutes, count = 3) {
  return departuresAt(routeKey, stopIndex, day)
    .filter((d) => d.minutes >= nowMinutes)
    .slice(0, count);
}

// The first trip that leaves `fromIndex` at/after nowMinutes and the arrival at `toIndex`.
// Routes are loops: if the destination comes earlier in the stop order, the shuttle reaches it
// on its next lap, so the arrival is taken from the following timed trip.
export function nextTrip(routeKey, fromIndex, toIndex, day, nowMinutes) {
  const rows = (SCHEDULE[routeKey]?.[day] ?? []).map(tripTimes);
  for (let k = 0; k < rows.length; k++) {
    const a = rows[k][fromIndex];
    if (!a || a.minutes < nowMinutes) continue;
    for (let j = k; j < rows.length; j++) {
      const b = rows[j][toIndex];
      if (b && b.minutes >= a.minutes && (j > k || toIndex > fromIndex)) {
        return { depart: a, arrive: b, ride: b.minutes - a.minutes };
      }
    }
  }
  return null;
}

// Last timed departure of the day from a stop (for "service has ended" messages).
export function lastDeparture(routeKey, stopIndex, day) {
  const list = departuresAt(routeKey, stopIndex, day);
  return list.length ? list[list.length - 1] : null;
}
