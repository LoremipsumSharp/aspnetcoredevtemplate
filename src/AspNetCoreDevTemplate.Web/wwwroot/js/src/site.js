import $ from 'jquery'
import '../../lib/jquery-validation/dist/jquery.validate'
import { layer } from "./header";



layer.alert(`jquery.validate loaded?${$().validate instanceof Function}`) 
//layer.msg("Hello World")