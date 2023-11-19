import Phaser from 'phaser'
import Skill from '../Classes/Skill/Skill'
import SkillTooltip from '../Classes/Entity/SkillTooltip'
import Entity from '../Classes/Entity/Entity'

export default class UIScene extends Phaser.Scene {

  skillTooltipsDict: {[key: string]: SkillTooltip} = {}

  constructor() {
    super('UIScene')
  }

  preload() {
  }

  async create() {
    const selectedTeam: Array<Entity> = this.registry.get('selectedTeam')
    this.createSkillTooltips(selectedTeam)
  }

  createSkillTooltips(selectedTeam: Array<Entity>): void {
    const width = Math.round(this.sys.canvas.width / 2.7)
    const height = this.sys.canvas.height * 0.25
    const x = Math.round(this.sys.canvas.width / 3.2)
    const y = Math.round(this.sys.canvas.height - (this.sys.canvas.height / 6.5))

    selectedTeam.forEach((entity: Entity, i) => {
      entity.skillArray.forEach((skill: Skill) => {
        this.skillTooltipsDict[skill.name + i] = new SkillTooltip(this, skill, width, height, x, y, i, 1)
      })
    })
  }

  setTooltipVisibility(skillName: string, entityIndex: number, visible: boolean): void {
    this.skillTooltipsDict[skillName + entityIndex].setVisible(visible)
  }

}