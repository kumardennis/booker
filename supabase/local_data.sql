SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "created_at", "name") VALUES
	(1, '2025-02-02 20:07:20.878678+00', 'Badminton');


--
-- Data for Name: clubs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."clubs" ("id", "created_at", "name", "email", "phone", "contact_person", "category_id", "image") VALUES
	(1, '2025-02-02 20:07:11.155624+00', 'Sulgapalli Klubi Fookus', 'info@skfookus.ee', '+372-556559558', 'Rainer Terras', 1, 'https://skfookus.ee/wp-content/uploads/2022/09/fookus-logo-1200-630.jpg');


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."addresses" ("id", "created_at", "address", "name", "club_id") VALUES
	(1, '2025-02-03 15:15:20.743161+00', 'Sõjakooli tn 10, Tallinn, Estonia', 'Forus Tennisekeskus', 1),
	(2, '2025-02-03 15:16:18.556557+00', 'E. Vilde tee 62, 13421 Tallinn, Estonia', 'Arte Gümnaasium', 1);


--
-- Data for Name: club_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."club_groups" ("id", "created_at", "club_id", "address_id", "max_occupancy", "start_time", "once_in_number_of_weeks", "day", "end_time", "level") VALUES
	(1, '2025-02-03 15:20:10.462491+00', 1, 1, 8, '18:00:00', 1, 'MONDAY', '19:30:00', 1),
	(2, '2025-02-03 15:20:47.841221+00', 1, 1, 12, '19:30:00', 2, 'MONDAY', '21:00:00', 1),
	(3, '2025-02-03 15:21:32.919955+00', 1, 2, 12, '20:00:00', 1, 'THURSDAY', '21:30:00', 1),
	(4, '2025-05-10 12:09:08.869845+00', 1, 2, 8, '17:00:00', 1, 'WEDNESDAY', '18:30:00', 3);


--
-- Data for Name: group_trainings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."group_trainings" ("id", "created_at", "group_id", "club_id", "max_occupancy", "start_timestamp", "end_timestamp", "level") VALUES
	(1, '2025-02-22 06:28:09.579276+00', 1, 1, 8, '2025-03-10 18:00:00', '2025-03-10 19:30:00', NULL),
	(2, '2025-02-22 06:31:32.2734+00', 2, 1, 12, '2025-03-10 19:30:00', '2025-03-10 21:00:00', NULL),
	(3, '2025-05-17 10:42:43.138467+00', 1, 1, 8, '2025-09-15 18:00:00', '2025-09-15 19:30:00', NULL),
	(5, '2025-05-17 10:46:31.661308+00', 2, 1, 12, '2025-09-15 19:30:00', '2025-09-15 21:00:00', NULL),
	(14, '2025-08-11 13:00:28.77018+00', 3, 1, 12, '2025-08-07 20:00:00', '2025-08-07 21:30:00', 1),
	(15, '2025-08-11 13:00:28.77018+00', 3, 1, 12, '2025-08-14 20:00:00', '2025-08-14 21:30:00', 1),
	(19, '2026-03-31 20:23:36.450888+00', 3, 1, 12, '2026-04-02 20:00:00', '2026-04-02 21:30:00', 1);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "created_at", "first_name", "last_name", "email", "phone", "profile_image", "user_id", "club_id", "is_trainer", "is_club_admin") VALUES
	(1, '2025-02-02 20:06:14.826323+00', 'Kärt', 'Ruutel', 'user1@test.com', '52233566', 'https://www.shutterstock.com/shutterstock/photos/1836020740/display_1500/stock-photo-profile-picture-of-smiling-millennial-asian-girl-isolated-on-grey-wall-background-look-at-camera-1836020740.jpg', '17419c4f-717d-46bf-8146-b0d7653ad289', 1, false, false),
	(2, '2025-02-02 20:09:55.163401+00', 'Egle', 'Kruus', 'user2@test.com', '+372-55688887', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?cs=srgb&dl=pexels-olly-3763188.jpg&fm=jpg', '5ff5dd5c-f1e9-4166-99e0-82158da8456c', 1, false, false),
	(3, '2025-02-02 20:11:16.48396+00', 'Mart', 'Eerma', 'user3@test.com', '+372-566588712', 'https://www.shutterstock.com/image-photo/happy-mid-aged-older-business-600nw-2322385015.jpg', '44c5412c-31cb-4d4f-ba15-80d0252b566a', 1, false, false),
	(4, '2025-02-02 20:12:49.797768+00', 'Rainer', 'Terras', 'trainer1@test.com', '+372-57458745', 'https://skfookus.ee/wp-content/uploads/2023/05/23.04.29-treenerid-2023-4x5-8-400x500.jpg', 'ed5b95d3-1f0d-4fa3-8dd0-5a2fe3f73425', 1, true, false),
	(5, '2025-02-02 20:14:11.404271+00', 'Sven Erik', 'Manglus', 'trainer2@test.com', '+372-58965896', 'https://skfookus.ee/wp-content/uploads/2024/05/23.10.21-Sven-ja-Laureen-TSK-186-400x500.jpg', '79c60994-401a-4da2-a441-08a60fa60d08', 1, true, false),
	(6, '2025-02-03 21:23:21.433013+00', 'Kalev', 'Jogi', 'waiter1@test.com', '+372-58235823', 'https://www.shutterstock.com/image-vector/young-smiling-man-avatar-3d-600nw-2124054758.jpg', 'aa958144-2317-4ca8-b757-af2ef0aec5e4', 1, false, false),
	(7, '2025-05-06 18:56:42.992339+00', 'Karl-Rasmus', 'Pungas', 'trainer3@test.com', '3495300393', 'https://skfookus.ee/wp-content/uploads/2023/05/23.04.29-treenerid-2023-4x5-4-240x300.jpg', '0eddaa52-7d33-4479-98e9-caedd3873b34', 1, true, true);


--
-- Data for Name: history_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."history_events" ("id", "created_at", "event", "group_id", "training_id", "event_type", "from_id", "to_id") VALUES
	(2, '2025-04-17 11:44:53.234298+00', 'Somebody robbed valge kapp', 1, NULL, 'GROUP_OTHERS', NULL, NULL),
	(3, '2025-04-17 11:45:44.098138+00', 'New guy joined and left damn', 3, NULL, 'GROUP_USER_JOIN', NULL, NULL),
	(11, '2025-06-24 14:01:00.998729+00', 'Mart Eerma deleted the request to join group', 4, NULL, 'GROUP_USER_JOIN_REQUEST', 3, NULL),
	(12, '2025-06-24 14:01:06.542778+00', 'Mart Eerma requested to join group', 4, NULL, 'GROUP_USER_JOIN_REQUEST', 3, NULL),
	(13, '2025-06-24 14:09:06.237361+00', 'Mart Eerma deleted the request to join group', 4, NULL, 'GROUP_USER_JOIN_REQUEST', 3, NULL),
	(14, '2025-06-25 17:11:39.549302+00', 'Accepted join group request for Karl-Rasmus Pungas', 1, NULL, 'GROUP_USER_JOIN', 4, 7),
	(15, '2026-03-31 20:45:09.090541+00', 'Karl-Rasmus Pungas requested to join training', NULL, 19, 'TRAINING_USER_JOIN_REQUEST', 7, NULL),
	(16, '2026-03-31 21:07:47.762975+00', 'Karl-Rasmus Pungas accepted the request to join training', NULL, 19, 'TRAINING_USER_JOIN', 7, NULL),
	(17, '2026-03-31 21:12:10.490879+00', 'Karl-Rasmus Pungas requested to join training', NULL, 19, 'TRAINING_USER_JOIN_REQUEST', 7, NULL),
	(18, '2026-03-31 21:12:17.788761+00', 'Karl-Rasmus Pungas accepted the request to join training for Karl-Rasmus Pungas', NULL, 19, 'TRAINING_USER_JOIN', 7, NULL),
	(19, '2026-03-31 21:18:35.69785+00', 'Karl-Rasmus Pungas requested to join group', 3, NULL, 'GROUP_USER_JOIN_REQUEST', 7, NULL);


--
-- Data for Name: join_group_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."join_group_requests" ("id", "created_at", "user_id", "club_group_id", "is_accepted", "is_rejected", "comments") VALUES
	(1, '2025-04-18 12:11:31.772263+00', 3, 3, true, false, NULL),
	(8, '2025-06-24 10:42:52.501232+00', 7, 1, true, false, NULL),
	(22, '2026-03-31 21:18:35.446805+00', 7, 3, false, false, NULL);


--
-- Data for Name: join_training_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."join_training_requests" ("id", "created_at", "user_id", "training_id", "is_accepted", "is_rejected", "comments") VALUES
	(1, '2025-05-17 10:58:21.391057+00', 2, 3, true, false, NULL),
	(2, '2025-05-24 12:37:37.384548+00', 3, 3, true, false, NULL),
	(12, '2026-03-31 21:12:10.340996+00', 7, 19, true, false, NULL);


--
-- Data for Name: notices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promo_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "created_at", "role") VALUES
	(1, '2025-05-01 10:45:27.394668+00', 'student'),
	(2, '2025-05-01 10:45:36.012283+00', 'trainer'),
	(3, '2025-05-01 10:45:45.532089+00', 'admin');


--
-- Data for Name: trainers_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."trainers_groups" ("id", "created_at", "trainer_id", "club_group_id") VALUES
	(1, '2025-02-03 16:15:22.637321+00', 4, 1),
	(2, '2025-02-03 16:15:32.850333+00', 5, 2),
	(3, '2025-02-03 16:15:40.13276+00', 5, 3),
	(4, '2025-05-10 12:13:49.809133+00', 7, 4);


--
-- Data for Name: trainers_trainings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."trainers_trainings" ("id", "created_at", "trainer_id", "training_id") VALUES
	(1, '2025-05-24 12:39:39.695963+00', 4, 3),
	(2, '2026-03-31 20:23:36.450888+00', 5, 19);


--
-- Data for Name: users_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_groups" ("id", "created_at", "user_id", "club_group_id", "is_active", "updated_at") VALUES
	(1, '2025-02-03 15:54:57.6972+00', 1, 1, true, NULL),
	(3, '2025-02-03 15:55:14.239385+00', 3, 1, true, NULL),
	(5, '2025-02-03 15:55:45.091263+00', 1, 2, true, NULL),
	(9, '2025-02-03 15:56:18.600564+00', 1, 3, true, NULL),
	(10, '2025-02-03 15:56:24.364983+00', 2, 3, true, NULL),
	(2, '2025-02-03 15:55:07.264385+00', 2, 1, true, '2025-05-08 16:13:43.681552+00'),
	(6, '2025-02-03 15:55:53.506511+00', 2, 2, true, '2025-05-10 11:53:55.238643+00'),
	(7, '2025-02-03 15:56:00.750185+00', 3, 2, false, '2025-05-10 11:54:02.636114+00'),
	(22, '2025-05-15 10:03:40.752198+00', 3, 3, false, '2025-05-15 10:44:00.50679+00'),
	(24, '2025-06-25 17:11:39.341853+00', 7, 1, true, NULL);


--
-- Data for Name: users_trainings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_trainings" ("id", "created_at", "user_id", "training_id", "marked_absent", "marked_absent_timestamp", "promo_code_id", "updated_at", "is_active") VALUES
	(1, '2025-05-17 10:59:45.134729+00', 2, 3, false, NULL, NULL, NULL, true),
	(2, '2025-05-24 12:56:58.527086+00', 3, 3, false, NULL, NULL, NULL, true),
	(12, '2025-08-11 13:00:28.77018+00', 1, 14, false, NULL, NULL, NULL, true),
	(13, '2025-08-11 13:00:28.77018+00', 2, 14, false, NULL, NULL, NULL, true),
	(14, '2025-08-11 13:00:28.77018+00', 3, 14, false, NULL, NULL, NULL, true),
	(15, '2025-08-11 13:00:28.77018+00', 1, 15, false, NULL, NULL, NULL, true),
	(16, '2025-08-11 13:00:28.77018+00', 2, 15, false, NULL, NULL, NULL, true),
	(17, '2025-08-11 13:00:28.77018+00', 3, 15, false, NULL, NULL, NULL, true),
	(23, '2026-03-31 20:23:36.450888+00', 1, 19, false, NULL, NULL, NULL, true),
	(24, '2026-03-31 20:23:36.450888+00', 2, 19, false, NULL, NULL, NULL, true),
	(26, '2026-03-31 21:12:17.744459+00', 7, 19, false, NULL, NULL, NULL, true);


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."addresses_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 1, false);


--
-- Name: club_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."club_groups_id_seq"', 1, true);


--
-- Name: clubs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."clubs_id_seq"', 1, false);


--
-- Name: group_trainings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."group_trainings_id_seq"', 19, true);


--
-- Name: history_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."history_events_id_seq"', 19, true);


--
-- Name: join_group_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."join_group_requests_id_seq"', 22, true);


--
-- Name: join_training_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."join_training_requests_id_seq"', 12, true);


--
-- Name: notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notices_id_seq"', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notifications_id_seq"', 1, false);


--
-- Name: promo_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."promo_codes_id_seq"', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 3, true);


--
-- Name: trainers_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trainers_groups_id_seq"', 1, true);


--
-- Name: trainers_trainings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trainers_trainings_id_seq"', 2, true);


--
-- Name: users_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_groups_id_seq"', 24, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 2, true);


--
-- Name: users_trainings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_trainings_id_seq"', 26, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
