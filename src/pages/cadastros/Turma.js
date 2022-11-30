import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TurmaService } from '../../service/cadastros/TurmaService';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { MultiSelect } from 'primereact/multiselect';


//{nome:'Frank', permissaoAlunos:[{permissao:{id:55}}]}

const Turma = () => {

    let objetoNovo = {
        nomeTurma: '',
        numeroMinimoTurma: '',
        anoIngressoTurma: '',
    };

    const [objetos, setObjetos] = useState(null);
    
    const [permissoes, setPermissoes] = useState(null);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [objeto, setObjeto] = useState(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const objetoService = new TurmaService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: objeto,
        validate: (data) => {
            let errors = {};

            if (!data.nomeTurma) {
                errors.nomeTurma = 'Nome da turma é obrigatório';
            }

            if (!data.numeroMinimoTurma) {
                errors.numeroMinimoTurma = 'Setar o número minímo de alunos por turma é obrigatório';
            }
            return errors;
        },
        onSubmit: (data) => {
            setObjeto(data);
            saveObjeto();
            formik.resetForm();
        }
    });

    useEffect(() => {
        if (objetos == null) {
            objetoService.listarTodos().then(res => {
                setObjetos(res.data)

            });
        }
    }, [objetos]);

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    }

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    }



    const saveObjeto = () => {
        setSubmitted(true);

        if (objeto.nomeTurma.trim()) {
            let _objeto = formik.values;
            if (objeto.id) {
                objetoService.alterar(_objeto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Alterado com Sucesso', life: 3000 });
                    setObjetos(null);
                });
            }
            else {
                objetoService.inserir(_objeto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserido com Sucesso', life: 3000 });
                    setObjetos(null);
                });

            }
            setObjetoDialog(false);
            setObjeto(objetoNovo);
        }
    }

    const editObjeto = (objeto) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const confirmDeleteObjeto = (objeto) => {
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = () => {

        objetoService.excluir(objeto.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });

            setObjetos(null);
            setObjetoDeleteDialog(false);

        });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _objeto = { ...objeto };
        _objeto[`${name}`] = val;

        setObjeto(_objeto);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Turma" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />

                </div>
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const nomeTurmaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nomeTurma</span>
                {rowData.nomeTurma}
            </>
        );
    }

    const numeroMinimoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">numeroMinimoTurma</span>
                {rowData.numeroMinimoTurma}
            </>
        );
    }

    const anoIngressoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">anoIngressoTurma</span>
                {rowData.anoIngressoTurma}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Registros Cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formularioTurma" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={objetos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter} emptyMessage="Sem objetos cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="nomeTurma" header="Nome da Turma" sortable body={nomeTurmaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="numeroMinimoTurma" header="Número Minímo de Estudantes" sortable body={numeroMinimoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="anoIngressoTurma" header="Ano da Turma" sortable body={anoIngressoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Cadastrar/Editar" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>
                        <form id="formularioTurma" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="nomeTurma">Nome da Turma*</label>
                                <InputText id="nomeTurma" value={formik.values.nomeTurma} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('nomeTurma') })} />
                                {getFormErrorMessage('nomeTurma')}
                            </div>

                            <div className="field">
                                <label htmlFor="numeroMinimoTurma">Número Minímo de Estudantes da Turma*</label>
                                <InputText type="number" min="3" max="25" id="numeroMinimoTurma" value={formik.values.numeroMinimoTurma} onChange={formik.handleChange} />
                            </div>

                            <div className="field">
                                <label htmlFor="anoIngressoTurma">Ano da Turma*</label>
                                <InputText id="anoIngressoTurma" value={formik.values.anoIngressoTurma} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('anoIngressoTurma') })} />
                                {getFormErrorMessage('anoIngressoTurma')}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && <span>Deseja Excluir?</span>}
                        </div>
                    </Dialog>


                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Turma, comparisonFn);
