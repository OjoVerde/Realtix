import * as control from '../controllers/formulario_controller.js'
import { Router } from "express";

const router = Router()
router.route('/localidades').get(control.getLocalidades)
router.route('/upl').get(control.getUPL)
router.route('/upz').get(control.getUPZ)
router.route('/UPLIntersectsLocalidad').get(control.UPLIntersectsLocalidad)
router.route('/UPZIntersectsLocalidadUPL').get(control.UPZIntersectsLocalidadUPL)
router.route('/GetPediatriaIPS').get(control.GetPediatriaIPS)

router.route('/NewIPS').post(control.NewIPS)
export default router