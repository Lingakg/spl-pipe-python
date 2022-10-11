import {spawn} from 'child_process'

export default function CleanPipe(ctx: any, option: any){
  return (next: Function) => {
    const {script} = option
    const py = spawn('python3', [script, JSON.stringify(option)])

    py.stdout!.on('data', (data) => {
      ctx.util.log.info('stdout msg:', String(data))
    });

    py.on('error', (error: Error) => {
      ctx.util.log.error(error)
    });

    py.on('close', (code: number) => {
      if(code == 0) {
        ctx.util.log.info(`process closed with exit code: ${code}`);
      } else {
        let errMsg = `process closed with exit code: ${code}`;
        ctx.util.log.error(new Error(errMsg));
      }
    });

    py.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
      ctx.util.log.info(`python file: ${option.script} process exits`, code, signal);
      next()
    });
  }
}
