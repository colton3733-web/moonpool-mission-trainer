import {describe,it,expect} from 'vitest';
import {createMission,stepMission,previewMission,actionsFor,valueOf,waterAccounts,solveMission,MissionState} from './index';
const run=(level:number,ids:string[],seed?:number)=>ids.reduce((s,id)=>stepMission(s,id),createMission(level,seed));
const phaseA=['start_transfer','advance','advance','report','continue'];
describe('shared contracts',()=>{
 it('preview never mutates state or spends actual resources',()=>{const s=createMission(1),before=structuredClone(s);const p=previewMission(s,'repair_scrubber');expect(s).toEqual(before);expect(valueOf(s,'priority')).toBe(1);expect(valueOf(p,'priority')).toBe(0)});
 it('invalid and disabled actions never spend',()=>{const s=createMission(2),p=stepMission(s,'plan_everything');expect(p.resources).toEqual(s.resources);expect(p.status).toBe('playing')});
 it('one-time repair cannot be charged twice',()=>{const s=run(1,['repair_scrubber']);expect(stepMission(s,'repair_scrubber').resources).toEqual(s.resources)});
 it('retry restores exact starting resources',()=>{const s=run(6,['supply_crew','supply_crops','planter','finish','retry']);expect(s).toEqual(createMission(6))});
});
describe('life support',()=>{
 it.each([['repair_scrubber',4,6,'complete'],['increase_oxygen',7,7,'paused'],['repair_lights',7,6,'paused']])('%s matches the outcome table',(id,co2,oxygen,status)=>{const s=run(1,[String(id),'advance']);expect(valueOf(s,'co2')).toBe(co2);expect(valueOf(s,'oxygen')).toBe(oxygen);expect(s.status).toBe(status)});
});
describe('energy',()=>{
 it.each([['plan_lights',2],['plan_rover',0],['plan_essentials',4],['plan_first_light',3],['plan_second_light',3]])('%s ends with %i energy',(p,n)=>{const s=run(2,[String(p),'advance','advance']);expect(valueOf(s,'battery')).toBe(n);expect(s.status).toBe('complete')});
 it('whole turn does not partially pay when a changed plan cannot afford it',()=>{const s=run(2,['plan_rover','toggle_light','advance','advance']);expect(s.status).toBe('paused');expect(valueOf(s,'battery')).toBe(1)});
});
describe('food',()=>{
 it('normal lighting finishes with 1 ordinary and 2 emergency',()=>{const s=run(3,['normal_lights','advance','advance','advance','advance']);expect(s.status).toBe('complete');expect(valueOf(s,'ordinary')).toBe(1);expect(valueOf(s,'emergency')).toBe(2);expect(s.log.filter(x=>x.includes('harvest arrived once'))).toHaveLength(1)});
 it('dim lighting uses exactly one emergency token and harvests once',()=>{const s=run(3,['dim_lights','advance','advance','authorize_emergency','advance','advance']);expect(s.status).toBe('complete');expect(valueOf(s,'ordinary')).toBe(2);expect(valueOf(s,'emergency')).toBe(1);expect(s.log.filter(x=>x.includes('harvest arrived once'))).toHaveLength(1)});
 it('missing authorization does not consume a partial meal',()=>{const before=run(3,['dim_lights','advance','advance']);const after=stepMission(before,'advance');expect(after.status).toBe('paused');expect(after.resources).toEqual(before.resources)});
});
describe('hazards',()=>{
 it.each([[false,2],[true,0]])('robot %s preserves protection and costs correctly',(robot,left)=>{const s=run(4,robot?['toggle_robot','run_plan']:['run_plan']);expect(s.status).toBe('complete');expect(valueOf(s,'battery')).toBe(left);expect(valueOf(s,'exposure')).toBe(4)});
 it('sample collection cannot substitute for protecting the crew',()=>{const s=run(4,['choose_outside','toggle_robot','run_plan']);expect(s.status).toBe('paused');expect(valueOf(s,'exposure')).toBe(6)});
});
describe('engineering',()=>{
 it('seal and independent backup meet both tests at zero budgets',()=>{const s=run(5,['repair_seal','build_backup','test']);expect(s.status).toBe('complete');expect(valueOf(s,'materials')).toBe(0);expect(valueOf(s,'shifts')).toBe(0)});
 it('backup first can finish the seal without restarting',()=>{const s=run(5,['build_backup','test','repair_seal','test']);expect(s.status).toBe('complete')});
 it('a shared failed branch is blocked without spending',()=>{const s=createMission(5);expect(stepMission(s,'invalid_route').resources).toEqual(s.resources)});
 it('a science room does not repair either safety requirement',()=>{const s=run(5,['build_room','repair_seal','test']);expect(s.goals.find(x=>x.id==='backup')?.met).toBe(false);expect(s.status).not.toBe('complete')});
});
describe('water',()=>{
 it.each([['finish',8,1,'complete'],['planter',6,1,'paused'],['skip',5,2,'paused']])('%s counts each water token once',(choice,clean,energy,status)=>{const ids=['supply_crew','supply_crops',...(choice==='skip'?[]:['recycle']),...(choice==='planter'?['planter']:[]),'finish'];let s=createMission(6);for(const id of ids){s=stepMission(s,id);expect(Object.values(waterAccounts(s)).reduce((a,b)=>a+b,0)).toBe(12)}expect(valueOf(s,'clean')).toBe(clean);expect(valueOf(s,'energy')).toBe(energy);expect(s.status).toBe(status)});
 it('crops may be supplied before crew',()=>{const s=run(6,['supply_crops','supply_crew','recycle','finish']);expect(s.status).toBe('complete')});
 it('recycling cannot run twice',()=>{const s=run(6,['supply_crew','supply_crops','recycle']);expect(stepMission(s,'recycle').resources).toEqual(s.resources)});
});
describe('mission planning',()=>{
 it.each([['start_camera',5,false],['start_battery',2,true]])('%s restores before reporting',(a,battery,camera)=>{const s=run(7,[String(a),'advance','advance','report']);expect(s.status).toBe('complete');expect(s.flags.restoredAt).toBe(2);expect(valueOf(s,'battery')).toBe(battery);expect(s.flags.camera).toBe(camera);expect(s.flags.earthArrival).toBe(12);expect(s.flags.earliestReply).toBe(22)});
 it('waiting for support stops at the local deadline',()=>{const s=run(7,['ask','wait']);expect(s.status).toBe('paused');expect(s.turn).toBe(6)});
 it('starting at minute4 and finishing exactly at6 is accepted',()=>{const s=run(7,['advance','advance','advance','advance','start_camera','advance','advance','report']);expect(s.status).toBe('complete');expect(s.flags.restoredAt).toBe(6)});
});
describe('integrated outpost',()=>{
 it('crew are at midpoint after one minute',()=>{const s=run(8,['start_transfer','advance']);expect(valueOf(s,'crew')).toBe(2);expect(s.flags.sheltered).toBe(false)});
 it('a start at minute3 finishes at the deadline',()=>{const s=run(8,['advance','advance','advance','start_transfer','advance','advance']);expect(s.flags.sheltered).toBe(true);expect(s.turn).toBe(5);expect(s.status).toBe('playing')});
 it('waiting misses the shelter deadline',()=>{const s=run(8,['advance','advance','advance','advance','advance']);expect(s.status).toBe('paused')});
 it('lights both rounds preserves emergency food and1energy',()=>{const s=run(8,[...phaseA,'repair_pump','toggle_light','advance','advance','collect_sample','advance']);expect(s.status).toBe('complete');expect(valueOf(s,'battery')).toBe(1);expect(valueOf(s,'ordinary')).toBe(3);expect(valueOf(s,'emergency')).toBe(2)});
 it('robot route uses one emergency token, reserve stays1',()=>{const s=run(8,[...phaseA,'repair_pump','deploy_robot','advance','advance','authorize_emergency','advance']);expect(s.status).toBe('complete');expect(valueOf(s,'battery')).toBe(1);expect(valueOf(s,'ordinary')).toBe(0);expect(valueOf(s,'emergency')).toBe(1)});
 it('postponing both optional jobs retains3energy',()=>{const s=run(8,[...phaseA,'repair_pump','advance','advance','collect_sample','authorize_emergency','advance']);expect(s.status).toBe('complete');expect(valueOf(s,'battery')).toBe(3)});
 it('robot plus one lit crisis round fails reserve',()=>{const s=run(8,[...phaseA,'repair_pump','deploy_robot','toggle_light','advance','toggle_light','advance']);expect(s.status).toBe('paused');expect(valueOf(s,'battery')).toBe(0)});
 it('an unaffordable whole round does not partially consume food',()=>{let s=run(8,[...phaseA,'repair_pump','deploy_robot','toggle_light','advance']);const food=valueOf(s,'ordinary');s=stepMission(s,'advance');expect(s.status).toBe('paused');expect(valueOf(s,'ordinary')).toBe(food)});
 it.each([0,1,2])('variant seed%i has an explicitly verified winning path',(seed)=>{const p=seed===0?[...phaseA,'repair_pump','toggle_light','advance','advance','collect_sample','advance']:seed===1?[...phaseA,'repair_pump','deploy_robot','advance','advance','authorize_emergency','advance']:[...phaseA,'repair_pump','advance','advance','collect_sample','authorize_emergency','advance'];expect(run(8,p,seed).status).toBe('complete')});
});
