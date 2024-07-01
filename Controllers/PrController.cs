using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Data;
using BugTrack.Models;
using NpgsqlTypes;

namespace BugTrack.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PrController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public static string? physicalPath;

        public PrController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
            sqlDataSource = _configuration.GetConnectionString("BtAppCon");

        }
        static string physicalPathInServer;
        DataTable table = new DataTable();
        NpgsqlDataReader myReader;
        string sqlDataSource;

        #region GET PRs
        [Route("get")]
        [HttpGet]
        public JsonResult Getrequests()
        {
            try
            {
                string query = @"select * from fn_select_pr()";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region SET PR

        [Route("set")]
        [HttpPost]
        public bool SetPR(ProblemReport pr)
        {
            try
            {
                string query = @"SELECT public.fn_insert_pr(@prnumber ,
                                               @description , 
                                               @stat ,
                                               @originator ,
                                               @dateoriginated ,
                                               @datecompleted ,
                                               @priority ,
                                               @prfixer ,
                                               @printroducer ,
                                               @proj ,
                                               @ddescription ,
                                               @etafixing )";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@prnumber", pr.prnumber);
                        myCommand.Parameters.AddWithValue("@description", pr.description);
                        myCommand.Parameters.AddWithValue("@stat", pr.status);
                        myCommand.Parameters.AddWithValue("@originator", pr.originator);
                        myCommand.Parameters.AddWithValue("@dateoriginated", pr.dateOriginated = DateTime.Now);
                        myCommand.Parameters.AddWithValue("@datecompleted", pr.dateCompleted != null? DateTime.Now: pr.dateCompleted);
                        myCommand.Parameters.AddWithValue("@priority", pr.priority);
                        myCommand.Parameters.AddWithValue("@prfixer", pr.prFixer);
                        myCommand.Parameters.AddWithValue("@printroducer", pr.prIntroducer);
                        myCommand.Parameters.AddWithValue("@proj", pr.project);
                        myCommand.Parameters.AddWithValue("@ddescription", pr.dDescription);
                        myCommand.Parameters.AddWithValue("@etafixing", pr.etaFixing);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (Int16.Parse(table.Rows[0]["fn_insert_pr"].ToString()) == 1)
                    {
                        if(physicalPathInServer != null)
                        {
                            FilePathToDB(physicalPathInServer,pr.prnumber);
                        }
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region UPDATE PR
        [Route("update")]
        [HttpPost]
        public bool UpdatePR(ProblemReport pr)
        {
            try
            {
                string query = @"SELECT public.fn_update_pr(@pid ,
                                               @descr , 
                                               @stat ,
                                               @originator ,
                                               @datecomp ,
                                               @priori ,
                                               @prfixer ,
                                               @printroducer ,
                                               @proj ,
                                               @ddesc ,
                                               @etafix )";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@pid", pr.prId);
                        myCommand.Parameters.AddWithValue("@descr", pr.description);
                        myCommand.Parameters.AddWithValue("@stat", pr.status);
                        myCommand.Parameters.AddWithValue("@originator", pr.originator);
                        myCommand.Parameters.AddWithValue("@datecomp", pr.dateCompleted == null? DateTime.MaxValue: pr.dateCompleted);
                        myCommand.Parameters.AddWithValue("@priori", pr.priority);
                        myCommand.Parameters.AddWithValue("@prfixer", pr.prFixer);
                        myCommand.Parameters.AddWithValue("@printroducer", pr.prIntroducer);
                        myCommand.Parameters.AddWithValue("@proj", pr.project);
                        myCommand.Parameters.AddWithValue("@ddesc", pr.dDescription);
                        myCommand.Parameters.AddWithValue("@etafix", pr.etaFixing == null ? DateTime.MaxValue : pr.etaFixing);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (Int16.Parse(table.Rows[0]["fn_update_pr"].ToString()) == 1)
                    {
                        if (physicalPathInServer != null)
                        {
                            FilePathToDB(physicalPathInServer, pr.prnumber);
                        }
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region DELETE PR
        [Route("delete")]
        [HttpPost]
        public bool DeletePR(ProblemReport pr)
        {
            try
            {
                string query = @"SELECT public.fn_delete_pr(@prid)";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@prid", pr.prId);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows[0]["fn_delete_pr"].ToString() == "1")
                    {

                        return true;
                    }
                    else if (table.Rows[0]["fn_delete_pr"].ToString() == "2")
                    {

                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion


        #region file upload to server
        [Route("set/file")]
        [HttpPost]
        //[Consumes("multipart/form-data")]
        public bool SaveFile()
        {
            try
            {
                var Path = @"D:\myProjects\BugTrack\ClientApp\src\assets\files\";
                var postedfile = Request.Form.Files[0];
                //var postedfile = httpRequest.Files[0];
                string filename = postedfile.FileName;
                //physicalPath = _env.ContentRootPath + "ClientApp/src/assets/files" + filename;
                physicalPath = Path + filename;
                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedfile.CopyTo(stream);
                }
                physicalPathInServer = physicalPath.ToString();
                if (physicalPath != String.Empty)
                {
                    return (true);
                }
                else
                {
                    return (false);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        //[Route("set/file")]
        //[HttpPost]
        ////[Consumes("multipart/form-data")]
        //public string SaveFile()
        //{
        //    try
        //    {
        //        var postedfile = Request.Form.Files[0];
        //        //var postedfile = httpRequest.Files[0];
        //        string filename = postedfile.FileName;
        //        physicalPath = _env.ContentRootPath + "ClientApp/src/assets/files" + filename;
        //        using (var stream = new FileStream(physicalPath, FileMode.Create))
        //        {
        //            postedfile.CopyTo(stream);
        //        }
        //        return (physicalPath = physicalPath.ToString());
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}
        #endregion


        #region set file path to db
        public bool FilePathToDB(String Path, string? prnumber)
        {
            try
            {
                string query = @"INSERT INTO public.prfiles(
	                             prid, prfilepath)
	                             VALUES ( (select prid from pr where prnumber=@prnumber), @path) RETURNING *;";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@path", Path);
                        myCommand.Parameters.AddWithValue("prnumber", prnumber);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {
                        physicalPathInServer = null;
                        return true;
                        
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region get file path from db
        [Route("get/file")]
        [HttpPost]
        public JsonResult GetFile([FromBody]int n)
        {
            try
            {
                string query = @"SELECT prfilepath FROM public.prfiles WHERE prfiles.prid = @id";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@id", n);

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion


        #region delete file path from db
        [Route("delete/file")]
        [HttpPost]
        public bool DeleteFilePathFromDB([FromBody]int id)
        {
            try
            {
                string query = @"DELETE FROM public.prfiles
	                             WHERE prfiles.prid=@id RETURNING *;";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion





        #region GET Developers List
        [Route("get/developers")]
        [HttpGet]
        public JsonResult GetDevs()
        {
            try
            {
                string query = @"select username,designation,r.role from public.user u 
                                 JOIN public.roles r on u.roleid = r.roleid 
                                 WHERE r.role = 'developer'";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region GET User List
        [Route("get/users")]
        [HttpGet]
        public JsonResult GetUsers()
        {
            try
            {
                string query = @"select u.userid,u.username,u.password,u.designation,r.role from public.user u 
                                 JOIN public.roles r on u.roleid = r.roleid";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion


        #region GET Projects List
        [Route("get/projects")]
        [HttpGet]
        public JsonResult GetProjects()
        {
            try
            {
                string query = @"select * from projects";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region SET Project
        [Route("set/project")]
        [HttpPost]
        public JsonResult Setproject(Projects prj)
        {
            try
            {
                string query = @"INSERT INTO public.projects(project)
	                                VALUES (@project) RETURNING *;";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@project", prj.Project);
                        myReader = myCommand.ExecuteReader();

                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {
                        return new JsonResult(true);
                    }
                    else
                    {
                        return new JsonResult(false);
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region UPDATE Project
        [Route("update/project")]
        [HttpPost]
        public JsonResult UpdateProject(Projects prj)
        {
            try
            {
                string query = @"UPDATE public.projects
	                            SET project=@projectname
	                            WHERE projectid=@projectid RETURNING *;";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@projectname", prj.Project);
                        myCommand.Parameters.AddWithValue("@projectid", prj.ProjectId);

                        myReader = myCommand.ExecuteReader();

                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {
                        return new JsonResult(true);
                    }
                    else
                    {
                        return new JsonResult(false);
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region DELETE Project
        [Route("delete/project")]
        [HttpPost]
        public bool DeleteProject(Projects p)
        {
            try
            {
                string query = @"DELETE FROM public.projects where projects.projectid = @projectid RETURNING *;";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@projectid", p.ProjectId);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {

                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region GET Comments
        [Route("get/comments")]
        [HttpGet]
        public JsonResult GetComments()
        {
            try
            {
                string query = @"select * from fn_select_comments()";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    return new JsonResult(table);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region SET Comment
        [Route("set/comment")]
        [HttpPost]
        public JsonResult SetComment(Comments com)
        {
            try
            {
                string query = @"select * from fn_insert_comments(@prid, @originator, @receiver, @statement, @commentedon)";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@prid", com.PrId);
                        myCommand.Parameters.AddWithValue("@originator", com.Originator);
                        myCommand.Parameters.AddWithValue("@receiver", com.Receiver);
                        myCommand.Parameters.AddWithValue("@statement", com.Statement);
                        myCommand.Parameters.AddWithValue("@commentedon", com.CommentedOn = DateTime.UtcNow);


                        myReader = myCommand.ExecuteReader();

                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows[0]["fn_insert_comments"].ToString() == "1")
                    {
                        return new JsonResult(true);
                    }
                    else
                    {
                        return new JsonResult(false);
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

    }


}
