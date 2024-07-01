using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Data;
using BugTrack.Models;

namespace BugTrack.Controllers
{
    
    [Route("[controller]")]
    [ApiController]

    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        DataTable table = new DataTable();
        NpgsqlDataReader myReader;
        string sqlDataSource;


        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
            sqlDataSource = _configuration.GetConnectionString("BtAppCon");

        }

        #region Login
        [Route("check")]
        [HttpPost]
        public bool LoginCheck(User user)
        {
            try
            {
                string query = @"SELECT public.fn_select_user(@usern,@passw)";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@usern", user.Username);
                        myCommand.Parameters.AddWithValue("@passw", user.Password);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows[0]["fn_select_user"].ToString() == "1")
                    {
                        SUserDetails.Username = user.Username;
                        GetUser();
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

        #region Capture Login & Role
        [Route("userdetails")]
        [HttpGet]
        public User GetUser()
        {
            
            try
            {
                string query = @"select userid,username,designation,r.role from public.user u 
                                    JOIN public.roles r on u.roleid = r.roleid
                                    WHERE u.username = @usern;";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@usern", SUserDetails.Username);


                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows.Count > 0)
                    {
                        SUserDetails.UserId = int.Parse(table.Rows[0]["userId"].ToString());
                        SUserDetails.Username = table.Rows[0]["username"].ToString();
                        SUserDetails.Designation = table.Rows[0]["designation"].ToString();
                        SUserDetails.Role = table.Rows[0]["role"].ToString();

                    }
                    return new User()
                    {
                        UserId = SUserDetails.UserId,
                        Username = SUserDetails.Username,
                        Designation = SUserDetails.Designation,
                        Role = SUserDetails.Role,
                    };

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region SET User
        [Route("set/user")]
        [HttpPost]
        public JsonResult Setuser(User usr)
        {
            try
            {
                string query = @"select fn_insert_user(@username,@password,@designation,@role);";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@username", usr.Username);
                        myCommand.Parameters.AddWithValue("@password", usr.Password);
                        myCommand.Parameters.AddWithValue("@designation", usr.Designation);
                        myCommand.Parameters.AddWithValue("@role", usr.Role);

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows[0]["fn_insert_user"].ToString() == "1")
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

        #region UPDATE User
        [Route("update/user")]
        [HttpPost]
        public JsonResult UpdateUser(User usr)
        {
            try
            {
                string query = @"select fn_update_user(@uid,@username,@password,@designation,@role);";

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@uid", usr.UserId);
                        myCommand.Parameters.AddWithValue("@username", usr.Username);
                        myCommand.Parameters.AddWithValue("@password", usr.Password);
                        myCommand.Parameters.AddWithValue("@designation", usr.Designation);
                        myCommand.Parameters.AddWithValue("@role", usr.Role);

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                    if (table.Rows[0]["fn_update_user"].ToString() == "1")
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

        #region DELETE User
        [Route("delete/user")]
        [HttpPost]
        public bool DeleteProject(User u)
        {
            try
            {
                string query = @"DELETE FROM public.user u WHERE u.userid =@userid RETURNING *;";
                DataTable table = new DataTable();
                NpgsqlDataReader myReader;
                string sqlDataSource = _configuration.GetConnectionString("BtAppCon");

                using (NpgsqlConnection myCon = new(sqlDataSource))
                {
                    myCon.Open();
                    using (NpgsqlCommand myCommand = new NpgsqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@userid", u.UserId);


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

    }

}
