/**
 * Creates an input model, which provides orbiting of the camera around a given transform
 * Useful for examinig and object by rotating the camera around it an seeing it from different angles
 * For multiple alternative inputs on the same control, enumerate all the input names, separated by comma.
 * Both digital and analog inputs are acceptable, such as keyboard, mouse, gamepad buttons as well as mouse coordinates and gamepad thumbsticks and triggers
 * For analog inputs, which provide positive and negative values, only one of two opposing controls is required. For example, when using the mouse to turn left and right, only the left or only the right control is sufficient in this case, because a negative value from the input would reverse the turning direction.
 * The model provides inputs to serve as manipulation conditions. If these inputs are provided, manipulating will only occur if the given conditional input is active. For example, to turn by moving the mouse, but only while mouse button is pressed, the mouse button must be provided as conditional input.
 * @param {Axis} context The instance of Axis, to which the model will be applied
 * @param {AxTransform} pivotalTransform The transform which is to act as a pivot for orbiting around
 * @param {AxTransform} orbitalTransform The transform which is to orbit around the pivotal transform. If null, the transform of the current camera in the scene is assumed
 * @param {Number} rotationSpeed The rotation speed multiplier in turns per second per input at which to turn
 * @param {Number} rotationResponsiveness The rotation responsiveness, where 0 is no responsiveness at all and greater values result in a more responsive rotation. Smaller values result in a more inert rotation. Must be greater than 0 in order for any rotation to occur
 * @param {String|AxString} upInput Names of the inputs to control the up rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} downInput Names of the inputs to control the down rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} leftInput Names of the inputs to control the left rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} rightInput Names of the inputs to control the right rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} rollLeftInput Names of the inputs to control the roll left rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} rollRightInput Names of the inputs to control the roll right rotation. Passing a null or empty string value would discard the control.
 * @param {String|AxString} orbitConditionInput Names of the inputs to serve as a condition for allowing orbiting. Passing a null or empty string value would discard the condition.
 * @returns {AxOrbitInputModel}
 */
function AxOrbitInputModel(context, pivotalTransform, orbitalTransform, rotationSpeed, rotationResponsiveness, upInput, downInput, leftInput, rightInput, rollLeftInput, rollRightInput, orbitConditionInput)
{
    AxInputModel.call(this);

    this.orbitVector = new AxVector3();

    this.upInput = new AxList();
    this.downInput = new AxList();
    this.leftInput = new AxList();
    this.rightInput = new AxList();
    this.rollLeftInput = new AxList();
    this.rollRightInput = new AxList();
    this.orbitConditionInput = new AxList();

    this.context = context;
    this.pivotalTransform = pivotalTransform;
    this.orbitalTransform = orbitalTransform;

    this.rotationSpeed = rotationSpeed;
    this.rotationResponsiveness = rotationResponsiveness;

    AxInputModel.ParseInputNames(this.context.input, this.upInput, upInput);
    AxInputModel.ParseInputNames(this.context.input, this.downInput, downInput);
    AxInputModel.ParseInputNames(this.context.input, this.leftInput, leftInput);
    AxInputModel.ParseInputNames(this.context.input, this.rightInput, rightInput);
    AxInputModel.ParseInputNames(this.context.input, this.rollLeftInput, rollLeftInput);
    AxInputModel.ParseInputNames(this.context.input, this.rollRightInput, rollRightInput);
    AxInputModel.ParseInputNames(this.context.input, this.orbitConditionInput, orbitConditionInput);
}

AxOrbitInputModel.prototype = Object.create(AxInputModel.prototype);


/**
 * Performs the input model routines
 */
AxOrbitInputModel.prototype.Process = function()
{
    var orbitalTransform = this.orbitalTransform !== null ? this.orbitalTransform : this.context.currentCamera.transformRef;
    
    if (AxUtils.IsUndefinedOrNull(this.pivotalTransform) || AxUtils.IsUndefinedOrNull(orbitalTransform))
        return;

    var speedFactor = this.context.timer.actualTime;

    var orbitVector = new AxVector3();
    if ((this.orbitConditionInput.count === 0) || AxInputModel.ProcessInputProperties(this.orbitConditionInput, speedFactor) !== 0.0)
    {
        orbitVector.x = AxInputModel.ProcessInputProperties(this.leftInput, speedFactor) - AxInputModel.ProcessInputProperties(this.rightInput, speedFactor);
        orbitVector.y = AxInputModel.ProcessInputProperties(this.upInput, speedFactor) - AxInputModel.ProcessInputProperties(this.downInput, speedFactor);
        orbitVector.z = AxInputModel.ProcessInputProperties(this.rollLeftInput, speedFactor) - AxInputModel.ProcessInputProperties(this.rollRightInput, speedFactor);
    }
    else
        orbitVector.Set(0.0);

    AxVector3.Lerp(this.orbitVector, this.orbitVector, orbitVector, AxMath.Trim(this.rotationResponsiveness * speedFactor, 0.0, 1.0));

    var rotationSpeedFactor = this.rotationSpeed * AxMath.Pi2;
    var rayStart = this.pivotalTransform.GetPositionExtrinsic();
    orbitalTransform.RotateAroundRayExtrinsic(rayStart, new AxVector3(0.0, 1.0, 0.0), this.orbitVector.x * rotationSpeedFactor);
    orbitalTransform.RotateAroundRayExtrinsic(rayStart, orbitalTransform.GetRightVectorExtrinsic(), -this.orbitVector.y * rotationSpeedFactor);
    orbitalTransform.RotateIntrinsic(new AxVector3(0.0, 0.0, this.orbitVector.z * rotationSpeedFactor));
};