import StatsModifier from "../Statistic/StatsModifier";
import Entity from "./Entity";
import Turnbar from "./Turnbar";
import HealthBar from "./HealthBar";
import ServerHandler from "../ServerHandler";
import Battle from "../Battle";
import SpriteWrapper from "../Animations/SpriteWrapper";
import AnimationsHandler from "../Animations/AnimationsHandler";
import ISkillAnimation from "../Skill/Animations/ISkillAnimation";

export default interface IBattleEntity {
  applyDamage(isCrit: boolean,value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void
  applyHeal(value: number, battleScene: Phaser.Scene): void
  applyBuffsAndStatus(buffs: Array<{name: string, duration: number}>, status: Array<{name: string, duration: number}>, battleScene: Phaser.Scene): void
  die(battle: Battle, battleScene: Phaser.Scene, animationsHandler: AnimationsHandler): void
  playTurn(battle: Battle, onTurnProcs:any, serverHandler: ServerHandler, animationsHandler: AnimationsHandler): void
  playAnim(animationName: string): void
  // playHurtThenIdle(animationHandler: AnimationsHandler): void
  endSkillSelection(): void
  endTurn(): void
  selectSkill(name: string): void
  updateHealth(): void
  updateDisplayTurnBar(turnbarValue: number): void
  // getSkillAnim(skillName: string): ISkillAnimation
  getFrontEntityX(): number
  getEntity(): Entity
  getIndex(): number
  getBattleSpeed(): number
  setBattleSpeed(value: number): void
  setOnCooldown(name: string, cooldown: number): void
  getPosition(): {x: number, y: number}
  getStatusArray(): Array<StatsModifier>
  getBuffsArray(): Array<StatsModifier>
  getCurrentHealth(): number
  getTurnbar(): Turnbar
  getSprite(): SpriteWrapper
  getHealthBar(): HealthBar
  getScaledValue(): number
  getName(): string
  isStunned(): boolean
  isDead(): boolean
}