import clc from 'cli-color';
import moment from 'moment';
const error = clc.red;
const info = clc.cyanBright;
const notice = clc.yellowBright;
const success = clc.green;

interface ILogMessage {
  date: number | Date;
  seen: string;
  type: string;
  log: any;
}

export class Logger {
  public logs: ILogMessage[];
  constructor() {
    this.logs = [];
  }

  addLogHistory(message: any, type = 'log') {
    const date = moment().valueOf();
    const seen = moment().fromNow(true);
    const log = { date, seen, type, log: message };
    this.logs.push(log);
  }

  history() {
    console.table(this.logs);
  }

  log(message: any, historyMsg?: any, type?: any) {
    const log = message + `\n`;
    const historyLog = historyMsg ?? message;
    this.addLogHistory(historyLog, type);
    process.stdout.write(log);
  }

  bold(message: string) {
    const log = clc.bold(message);
    this.log(log, message, 'bold');
  }

  error(message: any) {
    const log = error('[ERROR]') + ` ${message}`;
    this.log(log, message, 'error');
  }

  scrape(message: any) {
    const log = notice('[SCRAPE]') + ` ${message}`;
    this.log(log, message, 'scrape');
  }

  start() {
    const message = '• RUNNING SCRAPER •';
    const intro = `....\n ${message} \n....\n`;
    const style = { '.': notice('-----') };
    this.log(clc.art(intro, style), message, 'start');
  }

  success(message: any) {
    const log = success('[SUCCESS]') + ` ${message}`;
    this.log(log, message, 'success');
  }

  table(obj: { [key: string]: any }) {
    const tableHead = Object.keys(obj).map((th) => info(th));
    const tableBody = Object.values(obj);
    const table = clc.columns([tableHead, tableBody]);
    this.addLogHistory(obj, 'table');
    process.stdout.write(`\n ${table} \n`);
  }
}
