import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cheerio from 'cheerio';
import phantomjs from 'phantomjs-prebuilt';
import fs from 'fs';
import webdriverio, { remote } from 'webdriverio';
import schedule from 'node-schedule';

import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from './constant';
import { initSequelize } from './sequelize';
import { User } from './sequelize/types/user';

import axios from 'axios';

import { Sequelize, Op } from 'sequelize';
import { CollectionInformation } from './sequelize/types/collectionInformation';
import { Character } from './sequelize/types/character';
import { DailyTodo } from './sequelize/types/dailyTodo';
import { WeeklyTodo } from './sequelize/types/weeklyTodo';
import sequelize from 'sequelize';

const app = express();
const port = 4000;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

connection.connect();
app.use(cors());

initSequelize();

const job = schedule.scheduleJob('* * 6 * * *', function () {
  connection.query('update DailyTodo set isChecked = 0;');
  console.log('reset DailyTodo');
});

const job2 = schedule.scheduleJob('* * 6 * * 3', function () {
  connection.query('update WeeklyTodo set isChecked = 0;');
  console.log('reset DailyTodo');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/loadCollectionInformations', async (req: any, res) => {
  const { nickname, userID }: { nickname: string; userID: string } = req.query;

  const wdOpts = { capabilities: { browserName: 'phantomjs' } };

  const program = await phantomjs.run('--webdriver=4444');
  const browser = await remote(wdOpts as any);
  await browser.url(
    `https://lostark.game.onstove.com/Profile/Character/${nickname}`,
  );

  await browser.waitUntil(
    async () => {
      const element = await browser.$$('#lui-tab1-1');

      if (element.length > 0) {
        return true;
      }

      return false;
    },
    {
      timeout: 5000,
      timeoutMsg: 'expected text to be different after 5s',
    },
  );

  const mindOfIsland = await browser.$('#lui-tab1-1 .list');
  const starOfOrpheus = await browser.$('#lui-tab1-2 .list');
  const heartOfGiant = await browser.$('#lui-tab1-3 .list');
  const greatArt = await browser.$('#lui-tab1-4 .list');

  const mindOfIslandHtml = await mindOfIsland.getHTML();
  const starOfOrpheusHtml = await starOfOrpheus.getHTML();
  const heartOfGiantHtml = await heartOfGiant.getHTML();
  const greatArtHtml = await greatArt.getHTML();

  await browser.deleteSession();
  program.kill();

  const collectionInformations = [] as Array<{
    isSuccess: boolean;
    title: string;
    userID: string;
    category: string;
  }>;

  const $mindOfIslandHtml = cheerio.load(mindOfIslandHtml);
  const mindOfIslandHtmlArray = $mindOfIslandHtml('ul').children('li');
  mindOfIslandHtmlArray.map((index, element) => {
    const isSuccess = $mindOfIslandHtml(element).children('em').text();
    const title = $mindOfIslandHtml(element).children().remove().end().text();
    collectionInformations.push({
      isSuccess: isSuccess ? true : false,
      title: title.slice(0, title.length - 1),
      userID,
      category: '섬의 마음',
    });
  });

  const $starOfOrpheusHtml = cheerio.load(starOfOrpheusHtml);
  const starOfOrpheusHtmlArray = $starOfOrpheusHtml('ul').children('li');
  starOfOrpheusHtmlArray.map((index, element) => {
    const isSuccess = $starOfOrpheusHtml(element).children('em').text();
    const title = $starOfOrpheusHtml(element).children().remove().end().text();

    collectionInformations.push({
      isSuccess: isSuccess ? true : false,
      title: title.slice(0, title.length - 1),
      userID,
      category: '오르페우스의 별',
    });
  });

  const $heartOfGiantHtml = cheerio.load(heartOfGiantHtml);
  const heartOfGiantHtmlArray = $heartOfGiantHtml('ul').children('li');
  heartOfGiantHtmlArray.map((index, element) => {
    const isSuccess = $heartOfGiantHtml(element).children('em').text();
    const title = $heartOfGiantHtml(element).children().remove().end().text();

    collectionInformations.push({
      isSuccess: isSuccess ? true : false,
      title: title.slice(0, title.length - 1),
      userID,
      category: '거인의 심장',
    });
  });

  const $greatArtHtml = cheerio.load(greatArtHtml);
  const greatArtHtmlArray = $greatArtHtml('ul').children('li');
  greatArtHtmlArray.map((index, element) => {
    const isSuccess = $greatArtHtml(element).children('em').text();
    const title = $greatArtHtml(element).children().remove().end().text();

    collectionInformations.push({
      isSuccess: isSuccess ? true : false,
      title: title.slice(0, title.length - 1),
      userID,
      category: '위대한 미술품',
    });
  });

  await CollectionInformation.bulkCreate(collectionInformations);

  return res.send({ collectionInformations });
});

app.get('/api/login', async (req: any, res) => {
  const { email, password }: { email: string; password: string } = req.query;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(403).send(new Error('등록되지 않은 이메일입니다.'));
  }

  const isMatch = await bcrypt.compare(password, user!.password);

  if (!isMatch) {
    return res.status(403).send(new Error('비밀번호가 틀렸습니다.'));
  }

  return res.send({ user });
});

app.post('/api/signUp', async (req: any, res) => {
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = req.query;

  console.log(req.query);

  const saltRounds = 13;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return res.send({ user });
});

app.get('/api/collectionInformations', async (req: any, res) => {
  const { userID }: { userID: string } = req.query;

  const collectionInformations = await CollectionInformation.findAll({
    where: { userID },
  });

  return res.send({ collectionInformations });
});

app.post('/api/createCharacter', async (req: any, res) => {
  const { userID, name }: { userID: string; name: string } = req.query;

  const character = await Character.create({
    userID,
    name,
  });

  const DAILY_TODOS = [
    {
      title: '카오스던전',
    },
    {
      title: '카오스던전',
    },
    {
      title: '에포나',
    },
    {
      title: '에포나',
    },
    {
      title: '에포나',
    },
    {
      title: '가디언토벌',
    },
    {
      title: '가디언토벌',
    },
    {
      title: '호감도',
    },
  ];

  const WEEKLIY_TODOS = [
    {
      title: '에포나 중표',
    },
    {
      title: '도전 가디언 토벌',
    },
    {
      title: '도전 어비스 던전',
    },
    {
      title: '어비스 레이드',
    },
    {
      title: '어비스 던전',
    },
    {
      title: '발탄',
    },
    {
      title: '비아키스',
    },
    {
      title: '쿠크세이튼',
    },
  ];

  for (const ele of DAILY_TODOS) {
    await DailyTodo.create({
      title: ele.title,
      userID,
      isChecked: false,
      characterID: character.id,
    });
  }

  for (const ele of WEEKLIY_TODOS) {
    await WeeklyTodo.create({
      title: ele.title,
      userID,
      isChecked: false,
      characterID: character.id,
    });
  }

  return res.send({ character });
});

app.get('/api/characters', async (req: any, res) => {
  const { userID }: { userID: string; na } = req.query;

  const characters = await Character.findAll({
    where: {
      userID,
    },
    include: [
      {
        model: DailyTodo,
        as: 'dailyTodos',
        order: [['title', 'ASC']],
      },
      {
        model: WeeklyTodo,
        as: 'weeklyTodos',
      },
    ],
  });

  console.log(characters);

  return res.send({ characters });
});

app.post('/api/checkDailyTodo', async (req: any, res) => {
  const {
    id,
  }: {
    id: string;
  } = req.query;

  const dailyTodo = await DailyTodo.update(
    {
      isChecked: true,
    },
    { where: { id } },
  );

  return res.send(true);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
