/**
 * Creates an icosahedron with the given radius
 * New mesh vertices are created with their position filled
 * New mesh indices are created
 * @param {AxDeviceMesh} result The height scaling factor
 * @param {Number} radius The height scaling factor
 */
function AxIcosahedronGeometry(result, radius)
{
    // Generate icosahedron as from the vertices of three concentric, mutually orthogonal golden rectangles
    var k = radius / AxMath.Sqrt(1.0 * 1.0 + AxMath.Phi * AxMath.Phi);
    var w = AxMath.Phi * k;
    var h = 1.0 * k;

    result.CreateVertexBuffer(12);

    result.SetVertexPosition(0, new AxVector3(-h,	0.0,	w));
    result.SetVertexPosition(1, new AxVector3(h,	0.0,	w));
    result.SetVertexPosition(2, new AxVector3(-h,	0.0,	-w));
    result.SetVertexPosition(3, new AxVector3(h,	0.0,	-w));
    result.SetVertexPosition(4, new AxVector3(0.0,	w,	h));
    result.SetVertexPosition(5, new AxVector3(0.0,	w,	-h));
    result.SetVertexPosition(6, new AxVector3(0.0,	-w,	h));
    result.SetVertexPosition(7, new AxVector3(0.0,	-w,	-h));
    result.SetVertexPosition(8, new AxVector3(w,	h,	0.0));
    result.SetVertexPosition(9, new AxVector3(-w,	h,	0.0));
    result.SetVertexPosition(10, new AxVector3(w,	-h,	0.0));
    result.SetVertexPosition(11, new AxVector3(-w,	-h,	0.0));

    result.CreateIndexBuffer(20 * 3);

    result.SetIndex(0, 0);
    result.SetIndex(1, 4);
    result.SetIndex(2, 1);
    result.SetIndex(3, 0);
    result.SetIndex(4, 9);
    result.SetIndex(5, 4);
    result.SetIndex(6, 9);
    result.SetIndex(7, 5);
    result.SetIndex(8, 4);
    result.SetIndex(9, 4);
    result.SetIndex(10, 5);
    result.SetIndex(11, 8);
    result.SetIndex(12, 4);
    result.SetIndex(13, 8);
    result.SetIndex(14, 1);
    result.SetIndex(15, 8);
    result.SetIndex(16, 10);
    result.SetIndex(17, 1);
    result.SetIndex(18, 8);
    result.SetIndex(19, 3);
    result.SetIndex(20, 10);
    result.SetIndex(21, 5);
    result.SetIndex(22, 3);
    result.SetIndex(23, 8);
    result.SetIndex(24, 5);
    result.SetIndex(25, 2);
    result.SetIndex(26, 3);
    result.SetIndex(27, 2);
    result.SetIndex(28, 7);
    result.SetIndex(29, 3);
    result.SetIndex(30, 7);
    result.SetIndex(31, 10);
    result.SetIndex(32, 3);
    result.SetIndex(33, 7);
    result.SetIndex(34, 6);
    result.SetIndex(35, 10);
    result.SetIndex(36, 7);
    result.SetIndex(37, 11);
    result.SetIndex(38, 6);
    result.SetIndex(39, 11);
    result.SetIndex(40, 0);
    result.SetIndex(41, 6);
    result.SetIndex(42, 0);
    result.SetIndex(43, 1);
    result.SetIndex(44, 6);
    result.SetIndex(45, 6);
    result.SetIndex(46, 1);
    result.SetIndex(47, 10);
    result.SetIndex(48, 9);
    result.SetIndex(49, 0);
    result.SetIndex(50, 11);
    result.SetIndex(51, 9);
    result.SetIndex(52, 11);
    result.SetIndex(53, 2);
    result.SetIndex(54, 9);
    result.SetIndex(55, 2);
    result.SetIndex(56, 5);
    result.SetIndex(57, 7);
    result.SetIndex(58, 2);
    result.SetIndex(59, 11);
}
