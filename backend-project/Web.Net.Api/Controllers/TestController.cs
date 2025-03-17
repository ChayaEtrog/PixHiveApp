using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.Net.Api.Controllers
{
    public class TestController : Controller
    {
        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")] // רק Admin יכול לגשת
        public IActionResult AdminOnly()
        {
            return Ok("This is accessible only by Admins.");
        }

        [HttpGet("editor-or-admin")]
        [Authorize(Policy = "EditorOrAdmin")] // Editor או Admin יכולים לגשת
        public IActionResult EditorOrAdmin()
        {
            return Ok("This is accessible by Editors and Admins.");
        }

        [HttpGet("viewer-only")]
        [Authorize(Policy = "ViewerOnly")] // רק Viewer יכול לגשת
        public IActionResult ViewerOnly()
        {
            return Ok("This is accessible only by Viewers.");
        }

        [HttpGet("authenticated-only")]
        [Authorize] // כל משתמש מאומת יכול לגשת
        public IActionResult AuthenticatedOnly()
        {
            return Ok("This is accessible by any authenticated user.");
        }
    }
}
