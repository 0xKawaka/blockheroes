import BattleScene from "../../Scenes/BattleScene";
import Skill from "../Skill/Skill";

export default class SkillTooltip {
  rectangle: Phaser.GameObjects.Graphics
  text: Phaser.GameObjects.Text
  cooldown: Phaser.GameObjects.Text

  constructor(battleScene: BattleScene, skill: Skill, skillBarWidth:number, x:number, y:number, entityIndex: number) {

    this.rectangle = battleScene.add.graphics();
    this.rectangle.fillStyle(0x000000, 1);
    this.rectangle.setAlpha(0.7)
    let height = battleScene.sys.canvas.height * 0.2
    let width = skillBarWidth * 1.5
    this.rectangle.fillRoundedRect(x, y - height, width, height, 8);

    const startTextY = y - height * 0.95
    const fontSize = battleScene.sys.canvas.height * 0.014
    this.cooldown = battleScene.add.text(x + width - width * 0.2, startTextY, skill.cooldown.toString() + " turns", {fontFamily: "Verdana", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})

    this.text = battleScene.add.text(x + battleScene.sys.canvas.width * 0.01, startTextY, this.createText(skill), {fontFamily: "Verdana", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})
    this.text.setWordWrapWidth(skillBarWidth)
    this.text.setName("tooltip_" + skill.name + "_" + entityIndex.toString())

    this.setVisible(false)
  }

  setVisible(visible: boolean){
    this.rectangle.setVisible(visible)
    this.text.setVisible(visible)
    this.cooldown.setVisible(visible)
  }

  createText(skill: Skill): string {
    let text = ""
    text += skill.name + "\n" + "\n"
    text += "Targets " 
    if(skill.aoe)
      text += "all " + this.toPlural(skill.targetType) + "\n"
    else
      text += skill.targetType + "\n"
    
    skill.skillBuffArray.forEach(skillBuff => {
      text += "+ " + skillBuff.value * 100 + "% "+ skillBuff.name + " "
      if(skillBuff.aoe)
        text += "AOE "
      if(skillBuff.self)
        text += "self "
      text += skillBuff.duration + " turns" + "\n"
    })
    skill.skillStatusArray.forEach(skillStatus => {
      text += "- " + skillStatus.value * 100 + "% "+ skillStatus.name + " "
      if(skillStatus.aoe)
        text += "AOE "
      if(skillStatus.self)
        text += "self "
      text += skillStatus.duration + " turns" + "\n"
    })
    text += skill.description
    return text
  }

  toPlural(word: string): string {
    if(word[word.length - 1] === "y")
      return word.substring(0, word.length - 1) + "ies"
    else
      return word + "s"
  }
}