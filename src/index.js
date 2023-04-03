#!/usr/bin/env node
const program = require("commander");
const pkg = require("../package.json");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
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
      {
        type: "input",
        name: "name",
        message: "请输入项目描述",
      },
      {
        type: "input",
        name: "name",
        message: "请输入项目作者",
      },
      {
        type: "list",
        message: "请选择JavaScript框架?",
        name: "iframe",
        choices: ["React", "Vue"],
      },
      {
        type: "list",
        message: "请选择开发语言?",
        name: "lang",
        choices: ["TypeScript", "JavaScript"],
      },
      {
        type: "confirm",
        message: "是否开启项目规范？",
        name: "rules",
      },
    ]);
    console.log("answer", answer);
    // 出现加载图标
    let projectName = answer.name;
    const spinner = ora("Downloading...");
    let url = "";
    const { iframe, lang, rules } = answer;
    if (iframe === "React" && lang === "TypeScript" && rules) {
      url = "SunRay1017/xyl-react-template";
    } else {
      console.log("暂无模板！")
      return;
    }

    spinner.text = "疯狂加载中";
    spinner.color = "green";
    spinner.start();
    download(url, projectName, (err) => {
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

      packageFile,
        `module.exports = ${JSON.stringify(package, null, "\t")};`,
        "utf8";
      // 结束加载图标
      spinner.succeed();
      console.log(chalk.green("\n Generation completed!"));
      console.log("\n To get started");
      console.log(`\n    cd ${projectName} \n`);
    });
  });
program.parse(process.argv);
