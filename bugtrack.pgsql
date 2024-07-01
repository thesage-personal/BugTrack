PGDMP     8                
    z            bugtrack    14.4    14.4 8    )           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            *           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            +           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ,           1262    41092    bugtrack    DATABASE     d   CREATE DATABASE bugtrack WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_India.1252';
    DROP DATABASE bugtrack;
                postgres    false            -           0    0    DATABASE bugtrack    COMMENT     @   COMMENT ON DATABASE bugtrack IS 'for application bug tracking';
                   postgres    false    3372            �            1255    41198    fn_delete_pr(integer)    FUNCTION     �  CREATE FUNCTION public.fn_delete_pr(pid integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
vresult integer = 0;
begin
 -- logic
begin

DELETE FROM public.pr
	WHERE pr.prid = pid;
vresult = vresult + 1;

if((SELECT count(*) from public.comments where comments.prid = pid) > 0) THEN
DELETE FROM public.comments
	WHERE comments.prid = pid;
vresult = vresult + 1;
END IF;

EXCEPTION WHEN OTHERS THEN
RAISE;
vresult = -1;
end;
RETURN vresult;
end;
$$;
 0   DROP FUNCTION public.fn_delete_pr(pid integer);
       public          postgres    false            �            1255    41192 n   fn_insert_comments(integer, character varying, character varying, character varying, timestamp with time zone)    FUNCTION     �  CREATE FUNCTION public.fn_insert_comments(prid integer, originator character varying, receiver character varying, statement character varying, commentedon timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
vresult integer = 0;
o integer;
r integer;
begin
 -- logic
 SELECT userid into o from public.user where username = originator;
 SELECT userid into r from public.user where username = receiver;
 
begin

    INSERT INTO public.comments(
	                            prid, originatorid, receiverid, statement, commenton)
	                            VALUES ( prid, o, r, statement, commentedon);
vresult = 1;
exception when others then
RAISE;
vresult = -1;
end;
return vresult;
end;
$$;
 �   DROP FUNCTION public.fn_insert_comments(prid integer, originator character varying, receiver character varying, statement character varying, commentedon timestamp with time zone);
       public          postgres    false            �            1255    41154   fn_insert_pr(character varying, character varying, character varying, character varying, timestamp with time zone, timestamp with time zone, character varying, character varying, character varying, character varying, character varying, timestamp with time zone)    FUNCTION     O  CREATE FUNCTION public.fn_insert_pr(prnumber character varying, description character varying, stat character varying, originator character varying, dateoriginated timestamp with time zone, datecompleted timestamp with time zone, priority character varying, prfixer character varying, printroducer character varying, proj character varying, ddescription character varying, etafixing timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
vresult integer = 0;

statid integer;
prjid integer;
oid integer;
prfid integer;
priid integer;
begin

SELECT statusid into statid from public.state s where s.status = stat;
SELECT projectid into prjid from public.projects p where p.project = project;
SELECT userid into oid from public.user where username = originator;
SELECT userid into prfid from public.user where username = prfixer;
SELECT userid into priid from public.user where username = printroducer;

begin
INSERT INTO public.pr(
	 prnumber, description, statusid, originator, dateoriginated, datecompleted, priority, prfixer, printroducer, projectid, ddescription,  etafixing)
	VALUES ( prnumber, description, statid, oid, dateoriginated, datecompleted, priority, prfid, priid, prjid, ddescription, etafixing);
    
vresult = 1;
exception when others then
RAISE;
vresult:=-1;
end;

return vresult;
end;
$$;
 �  DROP FUNCTION public.fn_insert_pr(prnumber character varying, description character varying, stat character varying, originator character varying, dateoriginated timestamp with time zone, datecompleted timestamp with time zone, priority character varying, prfixer character varying, printroducer character varying, proj character varying, ddescription character varying, etafixing timestamp with time zone);
       public          postgres    false            �            1255    41160 Z   fn_insert_user(character varying, character varying, character varying, character varying)    FUNCTION     L  CREATE FUNCTION public.fn_insert_user(username character varying, password character varying, designation character varying, rolename character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
rolenumber integer = 0;
vresult integer = 0;
begin
 -- logic
Select roleid into rolenumber from public.roles where role = rolename;

begin

INSERT INTO public."user"(
	 username, password, designation, roleid)
	VALUES ( username, password, designation, rolenumber);
    
vresult = 1;
exception when others then
vresult = -1;
end;
return vresult;
end;
$$;
 �   DROP FUNCTION public.fn_insert_user(username character varying, password character varying, designation character varying, rolename character varying);
       public          postgres    false            �            1255    41193    fn_select_comments()    FUNCTION     �  CREATE FUNCTION public.fn_select_comments() RETURNS TABLE(commentid integer, prid integer, originator character varying, receiver character varying, statement character varying, status character varying, commenton timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
begin
 -- logic
 RETURN QUERY
SELECT co.commentid,pr.prid,u.username,u1.username,co.statement,s.status,co.commenton from public.comments co 
    Join public.pr pr on pr.prid = co.prid
    Join public.state s on pr.statusid = s.statusid
    Join public.user u on u.userid = co.originatorid
    Join public.user u1 on u1.userid = co.receiverid
    ORDER BY co.commenton ASC;
    
   --RAISE;
end;
$$;
 +   DROP FUNCTION public.fn_select_comments();
       public          postgres    false            �            1255    41147    fn_select_pr()    FUNCTION     H  CREATE FUNCTION public.fn_select_pr() RETURNS TABLE(prid integer, prnumber character varying, description character varying, status character varying, originator character varying, dateoriginated timestamp with time zone, datecompleted timestamp with time zone, priority character varying, prfixer character varying, printroducer character varying, project character varying, ddescription character varying, stepsrecreate character varying, etafixing date)
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
begin
 -- logic
 RETURN QUERY
 SELECT pr.prid, pr.prnumber, pr.description, s.status, u.username, pr.dateoriginated, pr.datecompleted, pr.priority, u1.username, u1.username, pj.project, pr.ddescription, pr.stepsrecreate, pr.etafixing
    FROM public.pr pr
    JOIN public.state s on pr.statusid = s.statusid
    JOIN public.user u on pr.originator = u.userid
    JOIN public.projects pj on pr.projectid = pj.projectid
    JOIN public.user u1 on pr.prfixer = u1.userid
    JOIN public.user u2 on pr.printroducer = u2.userid
    ORDER BY pr.prid ASC;
    
   --RAISE;
end;
$$;
 %   DROP FUNCTION public.fn_select_pr();
       public          postgres    false            �            1255    41150 4   fn_select_user(character varying, character varying)    FUNCTION     t  CREATE FUNCTION public.fn_select_user(usern character varying, passw character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
vresult integer;
begin

begin
 -- logic
 SELECT count(*) into vresult
	FROM public."user" WHERE username = usern AND password = passw;
 
 
 exception when others then
 RAISE;
end;
return vresult;
end
$$;
 W   DROP FUNCTION public.fn_select_user(usern character varying, passw character varying);
       public          postgres    false            �            1255    41168 �   fn_update_pr(integer, character varying, character varying, character varying, timestamp with time zone, character varying, character varying, character varying, character varying, character varying, timestamp with time zone)    FUNCTION     �  CREATE FUNCTION public.fn_update_pr(pid integer, descr character varying, stat character varying, originator character varying, datecomp timestamp with time zone, priori character varying, prfixer character varying, printroducer character varying, proj character varying, ddesc character varying, etafix timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
vresult integer = 0;

statid integer;
prjid integer;
oid integer;
prfid integer;
priid integer;

begin

SELECT statusid into statid from public.state s where s.status = stat;
SELECT projectid into prjid from public.projects p where p.project = project;
SELECT userid into oid from public.user where username = originator;
SELECT userid into prfid from public.user where username = prfixer;
SELECT userid into priid from public.user where username = printroducer;

begin
UPDATE public.pr
	SET  description=descr, statusid=statid, originator=oid, datecompleted=datecomp, priority=priori, prfixer=prfid, printroducer=priid, projectid=prjid, ddescription=ddesc, etafixing=etafix
	WHERE prid=pid;
    
vresult = 1;
exception when others then
RAISE;
vresult:=-1;
end;

return vresult;
end;
$$;
 I  DROP FUNCTION public.fn_update_pr(pid integer, descr character varying, stat character varying, originator character varying, datecomp timestamp with time zone, priori character varying, prfixer character varying, printroducer character varying, proj character varying, ddesc character varying, etafix timestamp with time zone);
       public          postgres    false            �            1255    41164 c   fn_update_user(integer, character varying, character varying, character varying, character varying)    FUNCTION     E  CREATE FUNCTION public.fn_update_user(uid integer, uname character varying, pword character varying, desig character varying, rolename character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
-- variable declaration
rolenumber integer = 0;
vresult integer = 0;

begin
 -- logic
Select roleid into rolenumber from public.roles where role = rolename;

begin

UPDATE public."user"
	SET  username=uname, password=pword, designation=desig, roleid=rolenumber
	WHERE userid=uid;
vresult = 1;
exception when others then
raise;
vresult = -1;
end;
return vresult;
end;
$$;
 �   DROP FUNCTION public.fn_update_user(uid integer, uname character varying, pword character varying, desig character varying, rolename character varying);
       public          postgres    false            �            1259    41185    comments    TABLE     �   CREATE TABLE public.comments (
    commentid integer NOT NULL,
    prid integer,
    originatorid integer,
    receiverid integer,
    statement character varying(100),
    commenton timestamp with time zone
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    41184    comments_commentid_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comments_commentid_seq;
       public          postgres    false    220            .           0    0    comments_commentid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;
          public          postgres    false    219            �            1259    41094    pr    TABLE     �  CREATE TABLE public.pr (
    prid integer NOT NULL,
    prnumber character varying(10) NOT NULL,
    description character varying(100),
    statusid integer,
    originator integer,
    dateoriginated timestamp with time zone,
    datecompleted timestamp with time zone,
    priority character varying(50),
    prfixer integer,
    printroducer integer,
    projectid integer,
    ddescription character varying(100),
    stepsrecreate character varying(50),
    etafixing date
);
    DROP TABLE public.pr;
       public         heap    postgres    false            �            1259    41093    pr_prid_seq    SEQUENCE     �   CREATE SEQUENCE public.pr_prid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.pr_prid_seq;
       public          postgres    false    210            /           0    0    pr_prid_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.pr_prid_seq OWNED BY public.pr.prid;
          public          postgres    false    209            �            1259    41136    projects    TABLE     d   CREATE TABLE public.projects (
    projectid integer NOT NULL,
    project character varying(50)
);
    DROP TABLE public.projects;
       public         heap    postgres    false            �            1259    41135    projects_projectid_seq    SEQUENCE     �   CREATE SEQUENCE public.projects_projectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.projects_projectid_seq;
       public          postgres    false    218            0           0    0    projects_projectid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.projects_projectid_seq OWNED BY public.projects.projectid;
          public          postgres    false    217            �            1259    41108    roles    TABLE     [   CREATE TABLE public.roles (
    roleid integer NOT NULL,
    role character varying(20)
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    41107    roles_roleid_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_roleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.roles_roleid_seq;
       public          postgres    false    214            1           0    0    roles_roleid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.roles_roleid_seq OWNED BY public.roles.roleid;
          public          postgres    false    213            �            1259    41129    state    TABLE     _   CREATE TABLE public.state (
    statusid integer NOT NULL,
    status character varying(50)
);
    DROP TABLE public.state;
       public         heap    postgres    false            �            1259    41128    state_statusid_seq    SEQUENCE     �   CREATE SEQUENCE public.state_statusid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.state_statusid_seq;
       public          postgres    false    216            2           0    0    state_statusid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.state_statusid_seq OWNED BY public.state.statusid;
          public          postgres    false    215            �            1259    41101    user    TABLE     �   CREATE TABLE public."user" (
    userid integer NOT NULL,
    username character varying(50),
    password character varying(50),
    designation character varying(50),
    roleid integer
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    41100    user_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.user_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.user_userid_seq;
       public          postgres    false    212            3           0    0    user_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.user_userid_seq OWNED BY public."user".userid;
          public          postgres    false    211            �           2604    41188    comments commentid    DEFAULT     x   ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);
 A   ALTER TABLE public.comments ALTER COLUMN commentid DROP DEFAULT;
       public          postgres    false    219    220    220            ~           2604    41097    pr prid    DEFAULT     b   ALTER TABLE ONLY public.pr ALTER COLUMN prid SET DEFAULT nextval('public.pr_prid_seq'::regclass);
 6   ALTER TABLE public.pr ALTER COLUMN prid DROP DEFAULT;
       public          postgres    false    210    209    210            �           2604    41139    projects projectid    DEFAULT     x   ALTER TABLE ONLY public.projects ALTER COLUMN projectid SET DEFAULT nextval('public.projects_projectid_seq'::regclass);
 A   ALTER TABLE public.projects ALTER COLUMN projectid DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    41111    roles roleid    DEFAULT     l   ALTER TABLE ONLY public.roles ALTER COLUMN roleid SET DEFAULT nextval('public.roles_roleid_seq'::regclass);
 ;   ALTER TABLE public.roles ALTER COLUMN roleid DROP DEFAULT;
       public          postgres    false    214    213    214            �           2604    41132    state statusid    DEFAULT     p   ALTER TABLE ONLY public.state ALTER COLUMN statusid SET DEFAULT nextval('public.state_statusid_seq'::regclass);
 =   ALTER TABLE public.state ALTER COLUMN statusid DROP DEFAULT;
       public          postgres    false    215    216    216                       2604    41104    user userid    DEFAULT     l   ALTER TABLE ONLY public."user" ALTER COLUMN userid SET DEFAULT nextval('public.user_userid_seq'::regclass);
 <   ALTER TABLE public."user" ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    212    211    212            &          0    41185    comments 
   TABLE DATA           c   COPY public.comments (commentid, prid, originatorid, receiverid, statement, commenton) FROM stdin;
    public          postgres    false    220   a[                 0    41094    pr 
   TABLE DATA           �   COPY public.pr (prid, prnumber, description, statusid, originator, dateoriginated, datecompleted, priority, prfixer, printroducer, projectid, ddescription, stepsrecreate, etafixing) FROM stdin;
    public          postgres    false    210   �[       $          0    41136    projects 
   TABLE DATA           6   COPY public.projects (projectid, project) FROM stdin;
    public          postgres    false    218   �\                  0    41108    roles 
   TABLE DATA           -   COPY public.roles (roleid, role) FROM stdin;
    public          postgres    false    214   �\       "          0    41129    state 
   TABLE DATA           1   COPY public.state (statusid, status) FROM stdin;
    public          postgres    false    216   ]                 0    41101    user 
   TABLE DATA           Q   COPY public."user" (userid, username, password, designation, roleid) FROM stdin;
    public          postgres    false    212   ^]       4           0    0    comments_commentid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.comments_commentid_seq', 13, true);
          public          postgres    false    219            5           0    0    pr_prid_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.pr_prid_seq', 9, true);
          public          postgres    false    209            6           0    0    projects_projectid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.projects_projectid_seq', 2, true);
          public          postgres    false    217            7           0    0    roles_roleid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.roles_roleid_seq', 3, true);
          public          postgres    false    213            8           0    0    state_statusid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.state_statusid_seq', 4, true);
          public          postgres    false    215            9           0    0    user_userid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.user_userid_seq', 5, true);
          public          postgres    false    211            �           2606    41190    comments comments_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    220            �           2606    41099 
   pr pr_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.pr
    ADD CONSTRAINT pr_pkey PRIMARY KEY (prid);
 4   ALTER TABLE ONLY public.pr DROP CONSTRAINT pr_pkey;
       public            postgres    false    210            �           2606    41141    projects projects_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (projectid);
 @   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pkey;
       public            postgres    false    218            �           2606    41113    roles roles_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (roleid);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    214            �           2606    41134    state state_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (statusid);
 :   ALTER TABLE ONLY public.state DROP CONSTRAINT state_pkey;
       public            postgres    false    216            �           2606    41106    user user_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    212            &   r   x�]�=!@�N1��������W�����2��^2�����2��Rw�1�������]�0]�. ĔQ2�g9�)H�`#��[U���u]��� a��'���^���0�"         �   x���A��0E��)�G�b���"؁�e�+"Ai@��	�0~^}�/=��n��2�$A?b�C��b��$���/�	&�[-1�[���C��9�0��cx�I>�Gtv~���4Ul�t��ڼo�M�h�o`���h���d�+~�M�~T`�\E����oۚL7���0�����$�,_���ݲQ�Z)�
rb�      $      x�3�vs����� z�          (   x�3�LL����2�,I-.I-�2�LI-K��/ �c���� �a	�      "   <   x�3��K-�2�(�O�I�Upˬ��K�2�K-�L�LN,����2�t��/NM����� �W|         N   x�3�LL���K,�442�,M��,�Tp�K̩,.�4�2�,J�(��:�ssr&��f�AH�ppiAj�!W� ��     