#!/usr/bin/env node
const program = require("commander");
const pkg = require("./package.json");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require("fs");
const path=require("path")
// 下载
const download = require("download-git-repo");
const ora = require("ora");

program.version(pkg.version);

program
  .command("create <name>")
  .description("初始化项目！")
  .action(async () => {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "请输入您的项目名称",
      },
    ]);
    // 出现加载图标
    let projectName = answer.name;
    const spinner = ora("Downloading...");
    const url = "SunRay1017/xyl-react-template";
    spinner.text = "疯狂加载中";
    spinner.color = "green";
    spinner.start();
    download(url, projectName,(err) => {
      if (err) {
        spinner.fail();
        console.log(chalk.red(`Generation failed. ${err}`));
        return;
      }
      // 将用户输入的内容，写入package.json内
      const packageFile = path.join(
        process.cwd(),
        projectName + "/package.json"
      );
      const package = require(packageFile);
      // package.description = description;
      package.name = projectName;
      
      
      (
        packageFile,
        `module.exports = ${JSON.stringify(package, null, "\t")};`,
        "utf8"
      );
      // 结束加载图标
      spinner.succeed();
      console.log(chalk.green("\n Generation completed!"));
      console.log("\n To get started");
      console.log(`\n    cd ${projectName} \n`);
    });
    // console.log(chalk.blue.bgRed.bold(answer.name));

    // console.log(
    //   "\r\n" +
    //     figlet.textSync("xyl", {
    //       font: "Ghost",
    //       horizontalLayout: "default",
    //       verticalLayout: "default",
    //       width: 80,
    //       whitespaceBreak: true,
    //     })
    // );
  });
program.parse(process.argv);
