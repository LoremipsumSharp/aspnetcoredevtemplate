

using System;
using AspNetCoreDevTemplate.Infastructure.Quartz;
using AspNetCoreDevTemplate.Serivces.Jobs;
using AspNetCoreDevTemplate.Web.Extensions;
using Microsoft.AspNetCore.Mvc;

public class MarkdownController : Controller
{
    public MarkdownController()
    {



    }
    public IActionResult Index()
    {
        return View();
    }
}